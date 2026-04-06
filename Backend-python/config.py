"""
Central configuration for python-ml-service.
Controls AI mode, model paths, and API key availability.
"""
import os
from dotenv import load_dotenv

load_dotenv()

# ---------------------------------------------------------------------------
# Model paths
# ---------------------------------------------------------------------------
MODELS_DIR = os.path.join(os.path.dirname(__file__), "models")

AVAILABLE_MODELS = [
    "GradientBoosting",
    "RandomForest",
    "AdaBoost",
    "XGBoost",
    "LogisticRegression",
    "DecisionTree",
    "KNN",
]

DEFAULT_MODEL = "GradientBoosting"

def model_path(name: str) -> str:
    return os.path.join(MODELS_DIR, f"{name}.pkl")

FEATURE_NAMES_PATH = os.path.join(MODELS_DIR, "feature_names.pkl")
LABEL_ENCODERS_PATH = os.path.join(MODELS_DIR, "label_encoders.pkl")

# ---------------------------------------------------------------------------
# AI mode  ("local" | "cloud")
# ---------------------------------------------------------------------------
_ai_mode: str = "local"

def get_ai_mode() -> str:
    return _ai_mode

def set_ai_mode(mode: str) -> None:
    global _ai_mode
    if mode not in ("local", "cloud"):
        raise ValueError(f"Invalid AI mode: {mode!r}. Must be 'local' or 'cloud'.")
    if mode == "cloud" and not is_cloud_available():
        raise ValueError("Cloud AI is not available: no valid API token found.")
    _ai_mode = mode

# ---------------------------------------------------------------------------
# Cloud API keys
# ---------------------------------------------------------------------------
OPENROUTER_API_KEY: str = os.getenv("OPENROUTER_API_KEY", "")
OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
HUGGINGFACE_API_KEY: str = os.getenv("HUGGINGFACE_API_KEY", "")

def is_cloud_available() -> bool:
    return bool(OPENROUTER_API_KEY or OPENAI_API_KEY)

def available_ai_modes() -> list[str]:
    modes = ["local"]
    if is_cloud_available():
        modes.append("cloud")
    return modes

# Auto-enable cloud mode if a key is present
if is_cloud_available():
    _ai_mode = "cloud"
