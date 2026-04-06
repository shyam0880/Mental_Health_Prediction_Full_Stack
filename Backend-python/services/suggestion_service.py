"""
Suggestion service — three-tier fallback:
  1. Local HuggingFace AI  (MBZUAI/LaMini-T5-738M text generation)
  2. Cloud OpenRouter/OpenAI
  3. Rule-based fallback (always works)
"""
import os
import logging

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Lazy-load LaMini-T5 model
# ---------------------------------------------------------------------------
_suggestion_chain = None
_lm_load_attempted = False
_lm_available = False

def _get_suggestion_chain():
    global _suggestion_chain, _lm_load_attempted, _lm_available
    if _lm_load_attempted:
        return _suggestion_chain
    _lm_load_attempted = True
    try:
        from transformers import pipeline
        from transformers.utils.logging import set_verbosity_error
        from langchain_huggingface import HuggingFacePipeline
        from langchain.prompts import PromptTemplate

        set_verbosity_error()
        logger.info("[suggestion_service] Loading LaMini-T5 model...")

        pipe = pipeline(
            "text2text-generation",
            model="MBZUAI/LaMini-T5-738M",
            device=-1,       # CPU
            max_length=256,
            do_sample=True,
            temperature=0.7,
        )
        llm = HuggingFacePipeline(pipeline=pipe)

        prompt = PromptTemplate.from_template(
            "You are a mental health assistant. An employee completed a workplace mental health survey.\n"
            "Prediction: {prediction}\n"
            "Employee data:\n{data_summary}\n\n"
            "Give specific, empathetic mental health advice in 3-4 sentences. "
            "Use 'you should', 'it helps to', or 'consider' phrasing.\n"
            "Advice:"
        )
        _suggestion_chain = prompt | llm
        _lm_available = True
        logger.info("[suggestion_service] LaMini-T5 loaded successfully.")
    except Exception as e:
        logger.warning(f"[suggestion_service] Could not load LaMini-T5: {e}")
        _suggestion_chain = None
        _lm_available = False
    return _suggestion_chain


# ---------------------------------------------------------------------------
# Tier 1 — Local HuggingFace (LaMini-T5)
# ---------------------------------------------------------------------------
def _hf_suggestion(prediction: str, data: dict) -> str:
    chain = _get_suggestion_chain()
    if chain is None:
        raise RuntimeError("LaMini-T5 model not available.")

    label = "Treatment recommended" if str(prediction) == "1" else "Good mental health"
    summary = "\n".join(f"{k.replace('_', ' ').capitalize()}: {v}" for k, v in data.items())

    result = chain.invoke({"prediction": label, "data_summary": summary})
    text = result.strip() if isinstance(result, str) else str(result).strip()

    if len(text) < 20:
        raise ValueError(f"LaMini-T5 returned too short a response: '{text}'")

    return text


# ---------------------------------------------------------------------------
# Tier 2 — Cloud OpenRouter/OpenAI
# ---------------------------------------------------------------------------
def _cloud_suggestion(prediction: str, data: dict) -> str:
    import httpx
    from config import OPENROUTER_API_KEY, OPENAI_API_KEY

    api_key = OPENROUTER_API_KEY or OPENAI_API_KEY
    if not api_key:
        raise RuntimeError("No cloud API key available.")

    base_url = "https://openrouter.ai/api/v1" if OPENROUTER_API_KEY else "https://api.openai.com/v1"
    model = os.getenv("MODEL", "openai/gpt-3.5-turbo")
    label = "Treatment recommended" if str(prediction) == "1" else "Good mental health"
    summary = "\n".join(f"{k.replace('_', ' ').capitalize()}: {v}" for k, v in data.items())

    prompt = (
        f"You are a compassionate mental health assistant. An employee completed a workplace mental health survey.\n"
        f"Prediction: {label}\n\nEmployee responses:\n{summary}\n\n"
        "Give specific, personalized mental health advice in 4-5 sentences based on their actual answers. "
        "Use 'you should', 'it helps to', or 'consider' phrasing. Be empathetic and practical."
    )

    response = httpx.post(
        f"{base_url}/chat/completions",
        json={"model": model, "messages": [{"role": "user", "content": prompt}],
              "max_tokens": 300, "temperature": 0.7},
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
        timeout=30,
    )
    response.raise_for_status()
    return response.json()["choices"][0]["message"]["content"].strip()


# ---------------------------------------------------------------------------
# Tier 3 — Rule-based fallback (always works, no dependencies)
# ---------------------------------------------------------------------------
def _rule_based_suggestion(prediction: str, data: dict) -> str:
    needs_treatment = str(prediction) == "1"

    def get(key): return str(data.get(key, "")).strip().lower()

    work_interfere  = get("work_interfere")
    family_history  = get("family_history")
    benefits        = get("benefits")
    remote          = get("remote_work")
    wellness        = get("wellness_program")
    mh_consequence  = get("mental_health_consequence")
    leave           = get("leave")
    obs_consequence = get("obs_consequence")
    care_options    = get("care_options")

    lines = []

    if needs_treatment:
        lines.append("⚠️ Based on your responses, our model suggests you may benefit from mental health support.")
        if work_interfere in ("often", "sometimes"):
            lines.append("Your mental health appears to interfere with work — consider speaking with a professional and discussing workload adjustments with your manager.")
        if family_history == "yes":
            lines.append("Given your family history, regular preventive check-ins with a therapist are especially important.")
        if benefits == "yes" and care_options == "no":
            lines.append("Your employer provides mental health benefits — explore what care options are available to you.")
        elif benefits == "no":
            lines.append("Your employer doesn't offer benefits — consider community mental health services or online therapy platforms.")
        if mh_consequence in ("yes", "maybe"):
            lines.append("If you're concerned about stigma at work, seek support through confidential external channels first.")
        if leave in ("somewhat difficult", "very difficult"):
            lines.append("Know that mental health conditions often qualify for protected medical leave.")
        if wellness == "yes":
            lines.append("Your employer has a wellness program — participating can provide structured support.")
        if obs_consequence == "yes":
            lines.append("You've observed negative consequences for colleagues — seek support through confidential external channels.")
        lines.append("💡 Daily habits that help: regular sleep, 30 min of physical activity, mindfulness, and limiting work outside hours.")
    else:
        lines.append("✅ Based on your responses, you appear to be in a good mental health state. Keep it up!")
        if work_interfere in ("sometimes", "rarely"):
            lines.append("Work does interfere occasionally — stay proactive by setting clear work-life boundaries.")
        if remote == "yes":
            lines.append("Remote work can feel isolating — schedule regular social interactions and virtual check-ins.")
        lines.append("💡 Keep maintaining: consistent sleep, regular exercise, social connection, and periodic self-check-ins.")

    return "\n\n".join(lines)


# ---------------------------------------------------------------------------
# Public interface — three-tier fallback
# ---------------------------------------------------------------------------
def generate_suggestion(prediction: str, data: dict, mode: str = "local") -> str:
    if mode == "cloud":
        try:
            return _cloud_suggestion(prediction, data)
        except Exception as e:
            logger.warning(f"[suggestion_service] Cloud failed: {e}. Trying local HuggingFace...")

    # Local: try HuggingFace first, then rule-based
    try:
        return _hf_suggestion(prediction, data)
    except Exception as e:
        logger.warning(f"[suggestion_service] HuggingFace failed: {e}. Using rule-based fallback.")
        return _rule_based_suggestion(prediction, data)
