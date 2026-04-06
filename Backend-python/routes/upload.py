"""
CSV upload and data analysis routes.
POST /upload_csv  → upload, clean, train all models, return full analysis
POST /upload      → upload, clean, return JSON data + stats for frontend table
"""
from flask import Blueprint, jsonify, request
import pandas as pd

from services.data_cleaning import clean_data, treatment_group_counts
from services.model_utils import train_all_models

upload_bp = Blueprint("upload", __name__)

# Columns used for treatment comparison charts
_CHART_COLUMNS = [
    "self_employed", "family_history", "work_interfere", "no_employees",
    "remote_work", "tech_company", "benefits", "care_options",
    "wellness_program", "seek_help", "anonymity", "leave",
    "mental_health_consequence", "phys_health_consequence", "coworkers",
    "supervisor", "mental_health_interview", "phys_health_interview",
    "mental_vs_physical", "obs_consequence",
]

_CATEGORICAL_COLS = [
    "self_employed", "family_history", "treatment", "work_interfere",
    "no_employees", "remote_work", "tech_company", "benefits", "care_options",
    "wellness_program", "seek_help", "anonymity", "leave",
    "mental_health_consequence", "phys_health_consequence", "coworkers",
    "supervisor", "mental_health_interview", "phys_health_interview",
    "mental_vs_physical", "obs_consequence",
]


def _yes_no_to_bool(val):
    if pd.isna(val):
        return None
    v = str(val).strip().lower()
    if v in ("yes", "y", "true", "1"):
        return True
    if v in ("no", "n", "false", "0"):
        return False
    return None


@upload_bp.post("/upload_csv")
def upload_csv():
    if "file" not in request.files:
        return jsonify({"error": "No file in request."}), 400

    file = request.files["file"]
    if not file.filename:
        return jsonify({"error": "No file selected."}), 400

    try:
        df_raw = pd.read_csv(file.stream)
        shape_before = df_raw.shape
        dup_count = int(df_raw.duplicated().sum())

        df = clean_data(df_raw.copy())

        # Value counts for every column (excluding noisy ones)
        excluded = {"Timestamp", "comments"}
        value_counts_data = {
            col: {str(k): int(v) for k, v in df[col].value_counts(dropna=False).items()}
            for col in df.columns if col not in excluded
        }

        # Categorical counts
        categorical_counts = {
            col: df[col].astype(str).value_counts(dropna=False).to_dict()
            for col in _CATEGORICAL_COLS if col in df.columns
        }

        overview = {
            "each_columns": df.columns.tolist(),
            "null_count": df.isnull().sum().to_dict(),
            "each_unique": df.nunique().to_dict(),
        }

        charts = treatment_group_counts(df, _CHART_COLUMNS)
        model_results = train_all_models(df.copy())
        gender_count = df["Gender"].value_counts().to_dict() if "Gender" in df.columns else {}

        return jsonify({
            "overview": overview,
            "shape": shape_before,
            "duplicates": dup_count,
            "describe": df.describe().to_dict(),
            "value_counts": value_counts_data,
            "categorical_counts": categorical_counts,
            "charts": charts,
            "gender_count": gender_count,
            "model_results": model_results,
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@upload_bp.post("/upload")
def upload_for_table():
    if "file" not in request.files:
        return jsonify({"error": "No file in request."}), 400

    file = request.files["file"]
    if not file.filename:
        return jsonify({"error": "No file selected."}), 400

    try:
        df = pd.read_csv(file.stream)
        df.columns = df.columns.str.strip()
        df = df.drop(columns=["comments", "Timestamp"], errors="ignore")
        df = clean_data(df)

        rename_map = {
            "Age": "age", "Gender": "gender", "Country": "country",
            "state": "state", "self_employed": "selfEmployed",
            "family_history": "familyHistory", "work_interfere": "workInterfere",
            "no_employees": "noEmployees", "remote_work": "remoteWork",
            "tech_company": "techCompany", "care_options": "careOptions",
            "seek_help": "seekHelp", "anonymity": "anonymity", "leave": "leave",
            "mental_health_consequence": "mentalHealthConsequence",
            "phys_health_consequence": "physHealthConsequence",
            "coworkers": "coworkers", "supervisor": "supervisor",
            "mental_health_interview": "mentalHealthInterview",
            "phys_health_interview": "physHealthInterview",
            "mental_vs_physical": "mentalVsPhysical",
            "obs_consequence": "obsConsequence", "treatment": "treatment",
            "benefits": "benefits", "wellness_program": "wellnessProgram",
        }
        df = df.rename(columns=rename_map)

        for field in ("selfEmployed", "treatment", "benefits", "techCompany", "remoteWork", "wellnessProgram"):
            if field in df.columns:
                df[field] = df[field].apply(_yes_no_to_bool)

        df.insert(0, "id", range(1, len(df) + 1))
        df["riskLevel"] = None

        stats = _compute_stats(df)
        chart_data = _generate_chart_data(df, df.columns.tolist())

        return jsonify({"data": chart_data, "stats": stats})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


def _compute_stats(df: pd.DataFrame) -> dict:
    total = len(df)
    avg_age = round(df["age"].mean()) if "age" in df.columns else 0
    gender_dist = df["gender"].value_counts().to_dict() if "gender" in df.columns else {}
    treatment_rate = (
        df[df["treatment"] == True].shape[0] / total if "treatment" in df.columns and total else 0
    )
    return {
        "totalRecords": total,
        "avgAge": avg_age,
        "genderDistribution": gender_dist,
        "treatmentRate": treatment_rate,
    }


def _generate_chart_data(df: pd.DataFrame, columns: list) -> dict:
    all_data = {}
    for col in columns:
        if col not in df.columns:
            continue
        total_counts = df[col].value_counts().to_dict()
        treated_counts = df[df["treatment"] == "Yes"][col].value_counts().to_dict() if "treatment" in df.columns else {}
        all_data[col] = [
            {col: val, "total_count": total_counts.get(val, 0), "treated_count": treated_counts.get(val, 0)}
            for val in total_counts
        ]
    return all_data
