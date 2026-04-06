"""
Chat service — three-tier fallback:
  1. Local HuggingFace AI  (MBZUAI/LaMini-T5-738M — text generation)
  2. Cloud OpenRouter/OpenAI
  3. Keyword-based fallback (always works, no dependencies)
"""
import os
import random
import logging

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Lazy-load LaMini-T5 (shared with suggestion_service via module-level cache)
# ---------------------------------------------------------------------------
_chat_pipeline = None
_hf_load_attempted = False
_hf_available = False

def _get_chat_pipeline():
    global _chat_pipeline, _hf_load_attempted, _hf_available
    if _hf_load_attempted:
        return _chat_pipeline
    _hf_load_attempted = True
    try:
        from transformers import pipeline
        from transformers.utils.logging import set_verbosity_error
        set_verbosity_error()
        logger.info("[chat_service] Loading LaMini-T5 model for chat...")
        _chat_pipeline = pipeline(
            "text2text-generation",
            model="MBZUAI/LaMini-T5-738M",
            device=-1,        # CPU
            max_length=300,
            do_sample=True,
            temperature=0.7,
        )
        _hf_available = True
        logger.info("[chat_service] LaMini-T5 loaded successfully.")
    except Exception as e:
        logger.warning(f"[chat_service] Could not load LaMini-T5: {e}")
        _chat_pipeline = None
        _hf_available = False
    return _chat_pipeline


# ---------------------------------------------------------------------------
# Tier 1 — Local HuggingFace (LaMini-T5 text generation)
# ---------------------------------------------------------------------------
def _hf_response(question: str, history: list) -> str:
    pipe = _get_chat_pipeline()
    if pipe is None:
        raise RuntimeError("LaMini-T5 model not available.")

    # Build conversation context from history
    conv = ""
    if history:
        for m in history[-6:]:
            role = "User" if m["role"] == "user" else "Assistant"
            conv += f"{role}: {m['content']}\n"

    prompt = (
        "You are a compassionate mental health support assistant. "
        "Provide helpful, empathetic advice about mental health, stress, anxiety, and wellbeing.\n"
        f"{conv}"
        f"User: {question}\n"
        "Assistant:"
    )

    result = pipe(prompt)
    text = result[0]["generated_text"].strip() if result else ""

    if len(text) < 10:
        raise ValueError(f"LaMini-T5 response too short: '{text}'")

    return text


# ---------------------------------------------------------------------------
# Tier 2 — Cloud OpenRouter/OpenAI
# ---------------------------------------------------------------------------
def _cloud_response(question: str, context: str, history: list) -> str:
    import httpx
    from config import OPENROUTER_API_KEY, OPENAI_API_KEY

    api_key = OPENROUTER_API_KEY or OPENAI_API_KEY
    if not api_key:
        raise RuntimeError("No cloud API key available.")

    base_url = "https://openrouter.ai/api/v1" if OPENROUTER_API_KEY else "https://api.openai.com/v1"
    model = os.getenv("MODEL", "openai/gpt-3.5-turbo")

    system_prompt = context or (
        "You are a compassionate mental health support assistant. "
        "Provide helpful, empathetic, conversational responses. "
        "Remember what the user said earlier and respond accordingly. "
        "Always encourage professional help when needed."
    )

    messages = [{"role": "system", "content": system_prompt}]
    for msg in history[-10:]:
        messages.append({"role": msg["role"], "content": msg["content"]})
    messages.append({"role": "user", "content": question})

    response = httpx.post(
        f"{base_url}/chat/completions",
        json={"model": model, "messages": messages, "max_tokens": 350, "temperature": 0.7},
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
        timeout=30,
    )
    response.raise_for_status()
    return response.json()["choices"][0]["message"]["content"].strip()


# ---------------------------------------------------------------------------
# Tier 3 — Keyword fallback (always works, no dependencies)
# ---------------------------------------------------------------------------
_KEYWORD_RESPONSES = {
    "stress":    "Stress is tough. Try short breaks, deep breathing, and setting clear work boundaries. Would you like more specific tips?",
    "stressed":  "Stress is tough. Try short breaks, deep breathing, and setting clear work boundaries. Would you like more specific tips?",
    "anxious":   "Anxiety can be overwhelming. Try the 5-4-3-2-1 grounding technique: name 5 things you see, 4 you feel, 3 you hear, 2 you smell, 1 you taste. Want more techniques?",
    "anxiety":   "Anxiety can be overwhelming. Try the 5-4-3-2-1 grounding technique: name 5 things you see, 4 you feel, 3 you hear, 2 you smell, 1 you taste. Want more techniques?",
    "depress":   "I'm here for you. Depression is real and treatable. Speaking with a therapist can make a big difference. Would you like to talk about what you're experiencing?",
    "sad":       "I'm sorry you're feeling sad. It's okay to feel this way. Can you tell me more about what's going on?",
    "burnout":   "Burnout is your mind and body saying they've been running on empty. Rest, boundaries, and reconnecting with things you enjoy are key. How long have you felt this way?",
    "lonely":    "Loneliness is more common than people admit. Even a short message to someone you trust can help. Would you like ideas for building connection?",
    "sleep":     "Poor sleep affects everything. Try a consistent sleep schedule, no screens 30 min before bed, and a cool dark room. How many hours are you getting?",
    "tired":     "Feeling tired can be physical or emotional. Rest is important — are you getting enough sleep, or does it feel like a deeper exhaustion?",
    "relax":     "Here are some ways to relax your body:\n• Deep breathing — inhale 4s, hold 4s, exhale 4s\n• Progressive muscle relaxation — tense and release each muscle group\n• A short walk outside\n• Warm bath or shower\n• Light stretching or yoga\n• Listening to calm music\nWould you like details on any of these?",
    "work":      "Work stress is very common. Is it the workload, relationships, or lack of meaning? Each has different solutions — tell me more.",
    "help":      "I'm here to help. You can share how you're feeling — stress, anxiety, sadness, or anything else on your mind.",
    "hello":     "Hello! How are you feeling today? I'm here to support you.",
    "hi":        "Hi there! How are you doing? Feel free to share what's on your mind.",
    "tip":       "Here are some evidence-based mental health tips:\n• 10 min of mindfulness daily\n• 20-30 min of exercise\n• 7-9 hours of sleep\n• Regular social connection\n• Scheduled breaks from screens\n• Journaling 3 things you're grateful for\nWhich would you like to explore more?",
    "tips":      "Here are some evidence-based mental health tips:\n• 10 min of mindfulness daily\n• 20-30 min of exercise\n• 7-9 hours of sleep\n• Regular social connection\n• Scheduled breaks from screens\n• Journaling 3 things you're grateful for\nWhich would you like to explore more?",
}

_DEFAULT_FALLBACK = [
    "I'm a mental health support assistant. I'm best at helping with stress, anxiety, burnout, or low mood. How are you feeling?",
    "Could you tell me more about how you're feeling? I'm here to listen and support you.",
    "I want to help. Are you dealing with stress, anxiety, or something else? Share as much or as little as you'd like.",
]

def _keyword_response(question: str, history: list) -> str:
    q = question.lower().strip()

    # Handle yes/no contextually using last bot message
    if q in ("yes", "yeah", "sure", "ok", "okay", "please", "yep", "yes please"):
        if history:
            last_bot = next((m["content"] for m in reversed(history) if m["role"] == "assistant"), "")
            lb = last_bot.lower()
            if "stress" in lb or "tip" in lb or "break" in lb:
                return _KEYWORD_RESPONSES["tips"]
            if "anxiety" in lb or "grounding" in lb:
                return _KEYWORD_RESPONSES["anxiety"]
            if "burnout" in lb:
                return _KEYWORD_RESPONSES["burnout"]
            if "sleep" in lb:
                return _KEYWORD_RESPONSES["sleep"]
            if "lonely" in lb:
                return _KEYWORD_RESPONSES["lonely"]
            if "relax" in lb or "breath" in lb or "muscle" in lb:
                return _KEYWORD_RESPONSES["relax"]
        return _KEYWORD_RESPONSES["tips"]

    if q in ("no", "nope", "not really"):
        return "That's okay. I'm here whenever you want to talk. Is there something else on your mind?"

    # Check keywords
    for keyword, reply in _KEYWORD_RESPONSES.items():
        if keyword in q:
            return reply

    return random.choice(_DEFAULT_FALLBACK)


# ---------------------------------------------------------------------------
# Public interface — three-tier fallback
# ---------------------------------------------------------------------------
def get_chat_response(question: str, context: str = "", history: list = None, mode: str = "local") -> str:
    if history is None:
        history = []

    if mode == "cloud":
        try:
            return _cloud_response(question, context, history)
        except Exception as e:
            logger.warning(f"[chat_service] Cloud failed: {e}. Trying local HuggingFace...")

    # Local: try LaMini-T5 first, then keyword fallback
    try:
        return _hf_response(question, history)
    except Exception as e:
        logger.warning(f"[chat_service] HuggingFace failed: {e}. Using keyword fallback.")
        return _keyword_response(question, history)
