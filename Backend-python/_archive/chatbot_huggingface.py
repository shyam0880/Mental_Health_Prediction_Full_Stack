from transformers import pipeline
from langchain_huggingface import HuggingFacePipeline
from langchain.prompts import PromptTemplate
from transformers.utils.logging import set_verbosity_error

# Suppress verbose logging
set_verbosity_error()

device = -1  # CPU only

# Lightweight summarization model (distilled version of BART)
# suggestion_model = pipeline("summarization", model="sshleifer/distilbart-cnn-12-6", device=device)
suggestion_model = pipeline(
    "text2text-generation", 
    model="MBZUAI/LaMini-T5-738M", 
    device=device,
    max_length=256,
    do_sample=True,
    temperature=0.7
)
llm = HuggingFacePipeline(pipeline=suggestion_model)

# Efficient Q&A model
qa_pipeline = pipeline("question-answering", model="deepset/roberta-base-squad2", device=device)

# --- Prompt Template for Suggestions ---
# suggestion_template = PromptTemplate.from_template(
#     "You are a helpful assistant. Based on the prediction result: {prediction} and the following employee data summary: {data_summary}, "
#     "suggest supportive actions or advice for the employee."
# )

suggestion_template = PromptTemplate.from_template(
    "You are a mental health assistant. Below is an employee's workplace and mental health context.\n"
    "Read the data carefully and suggest personalized mental health advice using 'you should', 'it helps to', or 'consider doing' style.\n\n"
    "Prediction: {prediction}\n"
    "Employee Data:\n{data_summary}\n\n"
    "Your advice:"
)

# --- Suggestion Chain ---
suggestion_chain = suggestion_template | llm

def summarize_employee_data(data: dict) -> str:
    return "\n".join([f"{key.replace('_', ' ').capitalize()}: {value}" for key, value in data.items()])
    # if prediction == "1":
    #     summary = (
    #     "You may be experiencing mental health challenges. You should talk to a mental health professional. "
    #     "It helps to take regular breaks, practice mindfulness, and seek support from coworkers or supervisors. "
    #     "Consider joining a wellness program if available."
    #     )
    # else:
    #     summary = (
    #     "You're doing well! You should continue healthy habits, take time for rest, and keep engaging with support networks. "
    #     "It helps to stay proactive about your mental well-being."
    #     )
    # return summary

# --- Suggestion Endpoint ---
def generate_suggestion(prediction: str, data: dict) -> str:
    try:
        summary = summarize_employee_data(data)
        response = suggestion_chain.invoke({"data_summary": summary,"prediction":prediction})
        return response.strip()
    except Exception as e:
        return f"Suggestion generation failed: {e}"

    

# --- Q&A Chatbot Endpoint ---
def bot_response(question: str, context: str) -> str:
    try:
        answer = qa_pipeline(question=question, context=context)
        return answer["answer"]
    except Exception as e:
        raise RuntimeError(f"Q&A failed: {e}")

