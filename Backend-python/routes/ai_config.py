"""
AI configuration routes.
GET  /ai/mode    → current AI mode
POST /ai/mode    → switch AI mode  { "mode": "local" | "cloud" }
GET  /ai/status  → available AI modes + cloud availability
GET  /ai/models  → list of available ML prediction models
"""
from flask import Blueprint, jsonify, request
import config

ai_bp = Blueprint("ai", __name__, url_prefix="/ai")


@ai_bp.get("/mode")
def get_mode():
    return jsonify({"mode": config.get_ai_mode()})


@ai_bp.post("/mode")
def set_mode():
    body = request.get_json(silent=True) or {}
    mode = body.get("mode", "").strip().lower()

    if not mode:
        return jsonify({"error": "Missing 'mode' field."}), 400

    try:
        config.set_ai_mode(mode)
        return jsonify({"mode": config.get_ai_mode(), "message": f"AI mode set to '{mode}'."})
    except ValueError as e:
        return jsonify({"error": str(e)}), 400


@ai_bp.get("/status")
def get_status():
    return jsonify({
        "current_mode": config.get_ai_mode(),
        "available_modes": config.available_ai_modes(),
        "cloud_available": config.is_cloud_available(),
    })


@ai_bp.get("/models")
def list_models():
    from services.model_utils import models_are_ready
    return jsonify({
        "models": config.AVAILABLE_MODELS,
        "default": config.DEFAULT_MODEL,
        "ready": models_are_ready(),
    })
