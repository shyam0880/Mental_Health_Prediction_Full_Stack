# from flask import Flask, request, jsonify
# from transformers import pipeline
# from langchain_huggingface import HuggingFacePipeline
# from langchain.prompts import PromptTemplate
# from transformers.utils.logging import set_verbosity_error

# set_verbosity_error()

# app = Flask(__name__)

# # --- Models (lightweight versions) ---
# # Suggestion summarization pipeline
# suggestion_model = pipeline("summarization", model="sshleifer/distilbart-cnn-12-6")  # Lightweight model
# llm = HuggingFacePipeline(pipeline=suggestion_model)

# # Q&A pipeline
# qa_pipeline = pipeline("question-answering", model="deepset/roberta-base-squad2")

# # --- Prompt Template for Suggestion ---
# suggestion_template = PromptTemplate.from_template(
#     "Based on the prediction result: {prediction} and the following employee data summary: {data_summary}, suggest supportive actions or advice for the employee."
# )

# # --- Build Suggestion Chain ---
# suggestion_chain = suggestion_template | llm

# # --- Suggestion Route ---
# @app.route("/suggest", methods=["POST"])
# def suggest():
#     data = request.json
#     prediction = data.get("prediction", "")
#     data_summary = data.get("data_summary", "")

#     try:
#         suggestion_input = {
#             "prediction": prediction,
#             "data_summary": data_summary
#         }

#         suggestion_text = suggestion_chain.invoke(suggestion_input)
#         return jsonify({"suggestion": suggestion_text.strip()})

#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# # --- Question Answering Route ---
# # @app.route("/ask", methods=["POST"])
# # def ask():

# def get_chatbot_response(question, context):
#     try:
#         answer = qa_pipeline(question=question, context=context)
#         return answer["answer"]
#     except Exception as e:
#         raise e  # Let the caller handle the exception


# if __name__ == "__main__":
#     app.run(debug=True)


from flask import Flask, request, jsonify
from nltk.stem import WordNetLemmatizer
import nltk
import random
nltk.download('wordnet')

lemmatizer = WordNetLemmatizer()
# from transformers import pipeline
# from langchain_huggingface import HuggingFacePipeline
# from langchain.prompts import PromptTemplate
# from transformers.utils.logging import set_verbosity_error

# set_verbosity_error()

# app = Flask(__name__)

# --- Models (lightweight versions) ---
# Suggestion summarization pipeline
# suggestion_model = pipeline("summarization", model="sshleifer/distilbart-cnn-12-6")
# llm = HuggingFacePipeline(pipeline=suggestion_model)

# Q&A pipeline
# qa_pipeline = pipeline("question-answering", model="deepset/roberta-base-squad2")

# --- Prompt Template for Suggestion ---
# suggestion_template = PromptTemplate.from_template(
#     "Based on the prediction result: {prediction} and the following employee data summary: {data_summary}, suggest supportive actions or advice for the employee."
# )

# --- Suggestion Chain ---
# suggestion_chain = suggestion_template | llm

# --- Responses dictionary for chatbot ---
responses = {
    "hello": "Hello! Welcome to our Mental Health Support Assistant. How are you feeling today?",
    "hi": "Hi there! I'm here to support you. How have you been feeling lately?",
    "sad": "I'm sorry you're feeling sad. Want to talk about what's been bothering you?",
    "anxious": "Anxiety can be overwhelming. Deep breathing and grounding exercises can help. Would you like to try one together?",
    "depressed": "I'm here for you. You're not alone. Would you like to see some coping strategies or talk it out?",
    "stress": "Stress is tough. Sometimes just taking a break and breathing helps. Want some stress relief tips?",
    "lonely": "Feeling lonely is more common than you think. I’m here to chat anytime. Would you like ideas for connection or support?",
    "panic": "It sounds like you might be feeling panicked. Try to take slow, deep breaths. I'm here with you.",
    "burnout": "Burnout is real, and it’s okay to feel exhausted. Rest is not a reward — it’s a necessity.",
    "fear": "Fear can feel very real. Would you like to talk about what’s worrying you?",
    "worthless": "You matter. You are worthy of kindness and support. I'm here for you.",
    "crying": "Crying can be healing. It's okay to let it out. Want to talk about what’s bringing this on?",
    "overwhelmed": "When everything feels like too much, one small step at a time can help. Want help breaking things down?",
    "angry": "Anger is valid. Do you want to talk about what's causing it?",
    "hopeless": "It may feel dark right now, but you're not alone. I'm here with you. Want to talk about it?",
    "thank you": "You're very welcome! You're doing your best, and that matters.",
    "thanks": "I'm happy to help. You're not alone.",
    "bye": "Take care of yourself. Remember, tough moments don't last forever. Goodbye for now.",
    "goodbye": "Goodbye. Be gentle with yourself today.",
    "help": "I’m here to support you. You can share how you’re feeling — whether it’s stress, sadness, fear, or anything else.",
    "breathe": "Let’s do a breathing exercise: Inhale slowly for 4 seconds, hold for 4 seconds, exhale for 4 seconds. Repeat as needed.",
    "support": "You can always reach out to someone you trust. Would you like a list of helplines or resources?",
    "better": "That’s wonderful to hear. Even small improvements are victories!",
    "not okay": "It’s okay to not be okay. Do you want to talk about what’s on your mind?",
    "okay": "Glad to hear that. If anything’s bothering you, I’m here.",
    "why me": "It’s natural to ask that. Life can feel unfair sometimes. Let’s talk it through.",
    "can’t do this": "I believe in you, even if it’s hard right now. You're stronger than you think.",
    "tired": "It’s okay to feel tired — emotionally or physically. Rest is healing. Want to talk about what’s draining you?",
    "empty": "Feeling empty can be really hard. Want to talk about what’s behind that feeling?",
    "nothing helps": "That’s a heavy feeling. Sometimes just being heard is a first step. I’m listening.",
    "lost": "Feeling lost happens to many of us. I'm here to help you sort through what you’re feeling.",
    "self care": "Taking care of yourself matters. Even a small act of kindness for yourself is self-care. Want some ideas?",
    "night": "Nights can feel lonelier. You're not alone, even in the quiet. I’m here with you.",
    "default": "I'm here to listen. You can share anything you're feeling — no judgment, just support."
}

default_responses = [
    "I didn't quite understand that. Could you please clarify or share more?",
    # "I'm here to listen whenever you need. Could you please tell me a bit more?",
    # "It's okay if it's hard to put into words. Try telling me a little more when you're ready.",
    # "I'm here with you. Can you help me understand a bit better?"
]


# --- Chatbot logic from Tkinter ---
# def bot_response(user_input):
#     user_input = user_input.lower()
#     if user_input in responses:
#         return responses[user_input]
#     elif 'service inquiry' in user_input:
#         return "We offer the following services: White label roadside assistance, accident management, consumer affairs, digital dispatch, insurance coverage, claims."
#     elif 'accident' in user_input:
#         return "Please provide your current location for assistance."
#     elif 'current location' in user_input or 'share location' in user_input:
#         return "Thanks for sharing the location. Our team will reach out to you."
#     elif 'account' in user_input:
#         return "If you have an account, you can log in to manage your services."
#     elif 'contact' in user_input:
#         return "For customer support, please call our hotline at 1-800-ROAD-HELP."
#     else:
#         return responses["default"]

def bot_response(user_input):
    user_input = user_input.lower()
    words = [lemmatizer.lemmatize(word) for word in user_input.split()]

    for keyword in responses:
        if keyword in words:
            return responses[keyword]

    return random.choice(default_responses)
# --- Chatbot API Endpoint ---
# @app.route("/chat", methods=["POST"])
# def chat():
#     data = request.json
#     user_input = data.get("message", "")

#     try:
#         response = bot_response(user_input)
#         return jsonify({"response": response})
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500
#         return jsonify({"error": str(e)}), 500

# # --- Suggestion API Endpoint ---
# @app.route("/suggest", methods=["POST"])
# def suggest():
#     data = request.json
#     prediction = data.get("prediction", "")
#     data_summary = data.get("data_summary", "")

#     try:
#         suggestion_input = {
#             "prediction": prediction,
#             "data_summary": data_summary
#         }
#         suggestion_text = suggestion_chain.invoke(suggestion_input)
#         return jsonify({"suggestion": suggestion_text.strip()})
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# # --- Function to get Q&A response (could be used in future) ---
# def get_chatbot_response(question, context):
#     try:
#         answer = qa_pipeline(question=question, context=context)
#         return answer["answer"]
#     except Exception as e:
#         raise e
# --- Run the Flask app ---
# if __name__ == "__main__":
#     app.run(debug=True)
#     app.run(debug=True)
