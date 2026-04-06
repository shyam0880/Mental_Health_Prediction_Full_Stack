"""
Chat route.
POST /chat  →  { "question": "...", "context": "...", "history": [...] }
             →  { "response": "...", "mode": "local|cloud" }

history format: [{ "role": "user"|"assistant", "content": "..." }, ...]
"""
from flask import Blueprint, jsonify, request
import config
from services.chat_service import get_chat_response

chat_bp = Blueprint("chat", __name__)


@chat_bp.post("/chat")
def chat():
    body = request.get_json(silent=True) or {}
    question = body.get("question", "").strip()
    context  = body.get("context", "").strip()
    history  = body.get("history", [])   # conversation history from frontend

    if not question:
        return jsonify({"error": "Missing 'question' field."}), 400

    mode = config.get_ai_mode()
    try:
        response = get_chat_response(question, context=context, history=history, mode=mode)
        return jsonify({"response": response, "mode": mode})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
