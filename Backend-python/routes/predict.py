"""
Prediction routes.
POST /predict           → predict with default model
POST /predict?model=X   → predict with a specific model
POST /suggest           → generate personalized suggestion
"""
from flask import Blueprint, jsonify, request
import config
from services.model_utils import predict, models_are_ready
from services.suggestion_service import generate_suggestion

predict_bp = Blueprint("predict", __name__)


@predict_bp.post("/predict")
def predict_endpoint():
    if not models_are_ready():
        return jsonify({
            "error": "Models not trained yet. Please upload a CSV dataset first."
        }), 503

    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "No JSON body provided."}), 400

    # Allow frontend to select model via query param or body field
    model_name = (
        request.args.get("model")
        or data.pop("model", None)
        or config.DEFAULT_MODEL
    )

    if model_name not in config.AVAILABLE_MODELS:
        return jsonify({
            "error": f"Unknown model '{model_name}'.",
            "available": config.AVAILABLE_MODELS,
        }), 400

    try:
        result = predict(data, model_name=model_name)
        print(f"[predict] model={model_name} input_keys={list(data.keys())} result={result}")
        return jsonify(result)
    except FileNotFoundError as e:
        return jsonify({"error": str(e)}), 503
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@predict_bp.post("/suggest")
def suggest_endpoint():
    body = request.get_json(silent=True) or {}
    prediction = body.get("prediction", "")
    data = body.get("data", {})

    if prediction == "" or not data:
        return jsonify({"error": "Missing 'prediction' or 'data' fields."}), 400

    mode = config.get_ai_mode()
    try:
        suggestion = generate_suggestion(str(prediction), data, mode=mode)
        return jsonify({"suggestion": suggestion, "mode": mode})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
