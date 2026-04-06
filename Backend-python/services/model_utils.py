"""
ML model training, loading, and prediction utilities.
Supports dynamic model selection via the `model` query parameter.
"""
import os
import joblib
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.ensemble import RandomForestClassifier, AdaBoostClassifier, GradientBoostingClassifier
from sklearn.preprocessing import LabelEncoder
from xgboost import XGBClassifier

from config import (
    AVAILABLE_MODELS,
    DEFAULT_MODEL,
    FEATURE_NAMES_PATH,
    LABEL_ENCODERS_PATH,
    model_path,
)

# ---------------------------------------------------------------------------
# In-memory cache: avoid reloading from disk on every request
# ---------------------------------------------------------------------------
_model_cache: dict = {}
_feature_names: list | None = None
_label_encoders: dict | None = None


def _model_registry() -> dict:
    return {
        "LogisticRegression": LogisticRegression(max_iter=200),
        "KNN": KNeighborsClassifier(n_neighbors=3),
        "DecisionTree": DecisionTreeClassifier(random_state=42),
        "RandomForest": RandomForestClassifier(n_estimators=100, random_state=42),
        "GradientBoosting": GradientBoostingClassifier(random_state=42),
        "AdaBoost": AdaBoostClassifier(random_state=42),
        "XGBoost": XGBClassifier(eval_metric="logloss", random_state=42),
    }


# ---------------------------------------------------------------------------
# Training
# ---------------------------------------------------------------------------
def train_all_models(df: pd.DataFrame) -> dict:
    """Train all models on df, persist to disk, return accuracy results."""
    global _feature_names, _label_encoders, _model_cache

    df = df.drop_duplicates()
    df = df.drop(columns=["Timestamp", "Country", "state", "comments"], errors="ignore")
    df = df[(df["Age"] >= 0) & (df["Age"] <= 100)]
    df["self_employed"] = df["self_employed"].fillna("No")
    df["work_interfere"] = df["work_interfere"].fillna("Not available")

    _label_encoders = {}
    for col in df.select_dtypes(include="object").columns:
        le = LabelEncoder()
        df[col] = le.fit_transform(df[col].astype(str))
        _label_encoders[col] = le

    os.makedirs(os.path.dirname(LABEL_ENCODERS_PATH), exist_ok=True)
    joblib.dump(_label_encoders, LABEL_ENCODERS_PATH)

    X = df.drop("treatment", axis=1)
    y = df["treatment"]

    _feature_names = X.columns.tolist()
    joblib.dump(_feature_names, FEATURE_NAMES_PATH)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.25, stratify=y, random_state=42
    )

    results = {}
    _model_cache.clear()

    for name, clf in _model_registry().items():
        clf.fit(X_train, y_train)
        preds = clf.predict(X_test)
        acc = accuracy_score(y_test, preds)
        results[name] = {"accuracy": round(acc, 4)}
        joblib.dump(clf, model_path(name))
        _model_cache[name] = clf  # cache in memory

    return results


# ---------------------------------------------------------------------------
# Loading
# ---------------------------------------------------------------------------
def _load_encoders_and_features() -> bool:
    """Load label encoders and feature names from disk. Returns True on success."""
    global _feature_names, _label_encoders
    try:
        _feature_names = joblib.load(FEATURE_NAMES_PATH)
        _label_encoders = joblib.load(LABEL_ENCODERS_PATH)
        return True
    except Exception as e:
        print(f"[model_utils] Could not load encoders/features: {e}")
        return False


def get_model(name: str = DEFAULT_MODEL):
    """Return a loaded model by name, using in-memory cache."""
    if name not in AVAILABLE_MODELS:
        raise ValueError(f"Unknown model '{name}'. Available: {AVAILABLE_MODELS}")

    if name not in _model_cache:
        path = model_path(name)
        if not os.path.exists(path):
            raise FileNotFoundError(
                f"Model file not found: {path}. "
                "Please upload a CSV to train models first."
            )
        _model_cache[name] = joblib.load(path)

    return _model_cache[name]


def get_feature_names() -> list:
    global _feature_names
    if _feature_names is None:
        _load_encoders_and_features()
    if _feature_names is None:
        raise RuntimeError("Feature names not available. Train models first.")
    return _feature_names


def get_label_encoders() -> dict:
    global _label_encoders
    if _label_encoders is None:
        _load_encoders_and_features()
    if _label_encoders is None:
        raise RuntimeError("Label encoders not available. Train models first.")
    return _label_encoders


def models_are_ready() -> bool:
    """Check whether trained model files exist on disk."""
    return (
        os.path.exists(FEATURE_NAMES_PATH)
        and os.path.exists(LABEL_ENCODERS_PATH)
        and os.path.exists(model_path(DEFAULT_MODEL))
    )


# ---------------------------------------------------------------------------
# Prediction
# ---------------------------------------------------------------------------
def build_feature_vector(input_map: dict) -> list:
    """Encode a raw input dict into the feature vector expected by the model."""
    feature_names = get_feature_names()
    label_encoders = get_label_encoders()
    vector = []

    for feature in feature_names:
        val = input_map.get(feature)
        if val is None:
            # Use the middle class index as a neutral default instead of 0
            le = label_encoders.get(feature)
            neutral = len(le.classes_) // 2 if le else 0
            vector.append(neutral)
            continue

        if feature in label_encoders:
            le = label_encoders[feature]
            val_str = str(val).strip()
            try:
                vector.append(int(le.transform([val_str])[0]))
            except ValueError:
                # Try case-insensitive match
                classes_lower = {c.lower(): c for c in le.classes_}
                matched = classes_lower.get(val_str.lower())
                if matched:
                    vector.append(int(le.transform([matched])[0]))
                else:
                    # Unknown value — use middle class as neutral
                    vector.append(len(le.classes_) // 2)
        else:
            try:
                vector.append(float(val))
            except (TypeError, ValueError):
                vector.append(0)

    return vector


def predict(input_data: dict, model_name: str = DEFAULT_MODEL) -> dict:
    """
    Run prediction for the given input using the specified model.
    Returns {"prediction": int, "model": str}
    """
    input_map = {
        "Age": int(input_data.get("age", 0)),
        "Gender": str(input_data.get("gender", "Other")).strip(),
        "self_employed": str(input_data.get("self_employed", "No")).strip(),
        "family_history": str(input_data.get("family_history", "No")).strip(),
        "work_interfere": str(input_data.get("work_interfere", "Not available")).strip(),
        "no_employees": str(input_data.get("no_employees", "1-5")).strip(),
        "remote_work": str(input_data.get("remote_work", "No")).strip(),
        "tech_company": str(input_data.get("tech_company", "No")).strip(),
        "benefits": str(input_data.get("benefits", "No")).strip(),
        "care_options": str(input_data.get("care_options", "No")).strip(),
        "wellness_program": str(input_data.get("wellness_program", "No")).strip(),
        "seek_help": str(input_data.get("seek_help", "No")).strip(),
        "anonymity": str(input_data.get("anonymity", "No")).strip(),
        "leave": str(input_data.get("leave", "No")).strip(),
        "mental_health_consequence": str(input_data.get("mental_health_consequence", "No")).strip(),
        "phys_health_consequence": str(input_data.get("phys_health_consequence", "No")).strip(),
        "coworkers": str(input_data.get("coworkers", "No")).strip(),
        "supervisor": str(input_data.get("supervisor", "No")).strip(),
        "mental_health_interview": str(input_data.get("mental_health_interview", "No")).strip(),
        "phys_health_interview": str(input_data.get("phys_health_interview", "No")).strip(),
        "mental_vs_physical": str(input_data.get("mental_vs_physical", "No")).strip(),
        "obs_consequence": str(input_data.get("obs_consequence", "No")).strip(),
    }

    clf = get_model(model_name)
    vector = build_feature_vector(input_map)
    result = int(clf.predict([vector])[0])
    return {"prediction": result, "model": model_name}
