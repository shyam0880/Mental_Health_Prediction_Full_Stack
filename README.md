# MentalHealthCheck — Workplace Mental Health Assessment Platform

An AI-powered platform that helps employees assess their workplace mental health, receive personalized advice, and explore data insights — all in one place.

---

## Screenshots


| Home Page | Home Page |
|---|---|
| ![Home Page](https://github.com/shyam0880/Mental_Health_Prediction_Full_Stack/blob/main/picture/picture_1.png?raw=true) | ![Home Page](https://github.com/shyam0880/Mental_Health_Prediction_Full_Stack/blob/main/picture/picture_2.png?raw=true) |

| Home Page | AI Assessment |
|---|---|
| ![Home Page](https://github.com/shyam0880/Mental_Health_Prediction_Full_Stack/blob/main/picture/picture_3.png?raw=true) | ![AI Assessment](https://github.com/shyam0880/Mental_Health_Prediction_Full_Stack/blob/main/picture/picture_4.png?raw=true) |

| Data Insights | AI Chat |
|---|---|
| ![Data Insights](https://github.com/shyam0880/Mental_Health_Prediction_Full_Stack/blob/main/picture/picture_5.png?raw=true) | ![AI Chat](https://github.com/shyam0880/Mental_Health_Prediction_Full_Stack/blob/main/picture/picture_6.png?raw=true) |

<!-- 
HOW TO ADD SCREENSHOTS:
1. Create a folder: docs/images/
2. Take screenshots of each page
3. Save them as: home.png, checkup.png, insights.png, chat.png
4. The table above will automatically display them
-->

---

## Related Repository

> 🔬 **ML Model Training (Google Colab)**
>
> The machine learning models used in this project were developed and trained in Google Colab.
> You can find the working notebook with full training code, EDA, and model evaluation here:
>
> **[Mental Health Prediction using ML — Google Colab](https://github.com/shyam0880/Mental_Health_prediction_using_ML)**
>
> That repository contains:
> - Full exploratory data analysis (EDA)
> - Data cleaning and preprocessing pipeline
> - Training all 7 ML models with evaluation metrics
> - Model comparison and selection
> - Export of trained `.pkl` files used in this project

---

## What It Does

- **AI Assessment** — 22-question survey that uses trained ML models to predict whether mental health treatment is recommended
- **Personalized Suggestions** — AI-generated advice based on your specific answers (local HuggingFace model or cloud OpenRouter)
- **AI Chat Assistant** — Conversational mental health support with full chat history, context awareness, and crisis resources
- **Data Insights** — Interactive dashboard with charts, statistics, and dataset exploration (1,250+ real survey records)
- **Dark / Light Mode** — Full theme support across all pages

---

## Tech Stack

### Frontend — `Frontend_React/`
| Category | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build Tool | Vite 5 |
| Routing | Wouter |
| UI Components | Radix UI + shadcn/ui |
| Styling | Tailwind CSS |
| Charts | Recharts |
| State / Data | TanStack React Query |
| Animations | Framer Motion |
| Icons | Lucide React |

### Backend — `python-ml-service/`
| Category | Technology |
|---|---|
| Framework | Flask + Flask-CORS |
| ML Models | scikit-learn, XGBoost |
| Data Processing | Pandas |
| Local AI (Chat) | HuggingFace Transformers — `MBZUAI/LaMini-T5-738M` |
| Local AI (Suggestions) | LangChain + LaMini-T5 |
| Cloud AI | OpenRouter API (OpenAI-compatible) |
| Model Serialization | Joblib |
| HTTP Client | httpx |

---

## Project Structure

```
Mental Health Project/
├── Frontend_React/               # React frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── home.tsx          # Landing page
│   │   │   ├── checkup.tsx       # 22-question ML assessment
│   │   │   ├── insights.jsx      # Data dashboard
│   │   │   ├── chat.tsx          # AI chat assistant
│   │   │   └── data-upload.tsx   # CSV upload & model training
│   │   ├── components/
│   │   │   ├── ui/               # 40+ shadcn/ui components
│   │   │   ├── navbar.tsx
│   │   │   ├── footer.tsx
│   │   │   ├── loading.tsx
│   │   │   ├── treatment-bar-chart.tsx
│   │   │   ├── model-bullet-chart.tsx
│   │   │   ├── data-quality-table.tsx
│   │   │   └── botpress-chat.tsx
│   │   ├── lib/
│   │   │   ├── queryClient.ts    # API client (proxies to Flask)
│   │   │   ├── mental-health.ts  # AI mode & model API helpers
│   │   │   └── theme.tsx         # Dark/light mode context
│   │   ├── App.tsx
│   │   └── data.js               # Static dataset (1,250 records)
│   ├── index.html
│   └── package.json
│
├── Backend-python/               # Python Flask backend
│   ├── app.py                    # Entry point
│   ├── config.py                 # AI mode, model paths, API keys
│   ├── requirements.txt
│   ├── .env                      # API keys (not committed)
│   ├── routes/
│   │   ├── predict.py            # POST /predict, POST /suggest
│   │   ├── chat.py               # POST /chat
│   │   ├── upload.py             # POST /upload_csv, POST /upload
│   │   └── ai_config.py          # GET/POST /ai/mode, /ai/status, /ai/models
│   ├── services/
│   │   ├── model_utils.py        # ML training, loading, prediction
│   │   ├── chat_service.py       # 3-tier chat fallback
│   │   ├── suggestion_service.py # 3-tier suggestion fallback
│   │   └── data_cleaning.py      # CSV preprocessing
│   └── models/                   # Trained .pkl files
│       ├── GradientBoosting.pkl
│       ├── RandomForest.pkl
│       ├── AdaBoost.pkl
│       ├── XGBoost.pkl
│       ├── LogisticRegression.pkl
│       ├── DecisionTree.pkl
│       ├── KNN.pkl
│       ├── feature_names.pkl
│       └── label_encoders.pkl
│
├── docs/
│   └── images/                   # Screenshots (add your own here)
│       ├── home.png
│       ├── checkup.png
│       ├── insights.png
│       └── chat.png
│
└── README.md
```

---

## ML Models

Seven classification models are trained on the OSMI Mental Health in Tech Survey dataset. All predict whether an employee is likely to need mental health treatment (binary: 0 = no, 1 = yes).

| Model | Typical Accuracy |
|---|---|
| GradientBoosting *(default)* | ~82% |
| AdaBoost | ~86% |
| RandomForest | ~82% |
| LogisticRegression | ~82% |
| XGBoost | ~80% |
| DecisionTree | ~74% |
| KNN | ~74% |

> Full training code, EDA, and model evaluation available in the [Colab notebook](https://github.com/shyam0880/Mental_Health_prediction_using_ML).

**Input features (22):** Age, Gender, Self-employed, Family history, Work interference, Company size, Remote work, Tech company, Benefits, Care options, Wellness program, Seek help, Anonymity, Leave difficulty, Mental/physical health consequence, Coworker/supervisor discussion, Interview disclosure, Mental vs physical priority, Observed consequences.

---

## AI Chat — Three-Tier Fallback

```
Request → Cloud (OpenRouter)  ──fails──→  Local (LaMini-T5)  ──fails──→  Keyword fallback
```

| Tier | Model | Requires |
|---|---|---|
| Cloud | OpenRouter `openrouter/auto` | `OPENROUTER_API_KEY` in `.env` |
| Local | `MBZUAI/LaMini-T5-738M` (CPU) | ~738MB download (cached globally) |
| Fallback | Keyword matcher | Nothing |

The backend auto-enables cloud mode on startup if an API key is present.

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/predict` | Predict treatment need (add `?model=X` to select model) |
| `POST` | `/suggest` | Generate personalized AI advice |
| `POST` | `/chat` | Send chat message (with conversation history) |
| `POST` | `/upload_csv` | Upload CSV, train all 7 models, return analysis |
| `POST` | `/upload` | Upload CSV, return cleaned data for table |
| `GET` | `/ai/status` | Current AI mode + available modes |
| `GET/POST` | `/ai/mode` | Get or set AI mode (`local` / `cloud`) |
| `GET` | `/ai/models` | List available ML models |

---

## Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.11+
- **Git**

Optional (for local AI):
- ~2GB disk space for HuggingFace model cache
- Models download automatically on first use

---

## Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/shyam0880/Mental_Health_prediction_using_ML.git
cd Mental_Health_prediction_using_ML
```

### 2. Backend setup

```bash
cd python-ml-service

# Create virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Configure environment variables

Create `python-ml-service/.env`:

```env
# Required for cloud AI mode (get a free key at https://openrouter.ai)
OPENROUTER_API_KEY=your_openrouter_key_here
MODEL=openrouter/auto

# Optional fallback
OPENAI_API_KEY=

# Optional (HuggingFace private models)
HUGGINGFACE_API_KEY=
```

> If no API key is provided, the backend runs in local mode using the LaMini-T5 model.

### 4. Start the backend

```bash
# From python-ml-service/ with venv activated
python app.py
# → Running on http://localhost:5000
```

### 5. Frontend setup

```bash
cd Frontend_React
npm install
npm run dev
# → Running on http://localhost:5173
```

---

## First-Time Use

The ML models are already pre-trained and included in `python-ml-service/models/`. You can start using the assessment immediately without uploading any data.

If you want to retrain on your own dataset:
1. Go to `http://localhost:5173/upload`
2. Upload a CSV file matching the OSMI Mental Health survey format
3. All 7 models retrain automatically

---

## Features Overview

| Page | URL | Description |
|---|---|---|
| Home | `/` | Overview, live stats, feature highlights |
| AI Assessment | `/checkup` | 22-question survey → ML prediction + AI advice |
| Data Insights | `/insights` | Charts, dataset table, model accuracy |
| AI Assistant | `/chat` | Mental health chatbot with history |
| Upload Data | `/upload` | CSV upload & model retraining *(internal use)* |

**Additional features:**
- Assessment history stored locally (last 10 results)
- Chat history persists across page refreshes
- AI mode switcher (local ↔ cloud) in the chat header
- Backend status indicator (online/offline) in chat
- Dark / light mode toggle in navbar
- Custom 404 page and loading screen

---

## Dataset

The project uses the [OSMI Mental Health in Tech Survey](https://www.kaggle.com/datasets/osmi/mental-health-in-tech-survey) dataset (1,259 records, 27 features). The cleaned version with 1,250 records is bundled in `Frontend_React/src/data.js` for offline use.

---

## .gitignore Recommendations

Add these to your `.gitignore` before pushing:

```gitignore
# Python
python-ml-service/venv/
python-ml-service/__pycache__/
python-ml-service/**/__pycache__/
python-ml-service/.env

# Node
Frontend_React/node_modules/
Frontend_React/dist/

# Misc
*.pyc
.DS_Store
```

> **Important:** Never commit your `.env` file. It contains API keys.

---

## Author

**Shyam Patel** — Full Stack Developer & AI/ML Enthusiast

- GitHub: [@shyam0880](https://github.com/shyam0880)
- ML Notebook: [Mental Health Prediction using ML](https://github.com/shyam0880/Mental_Health_prediction_using_ML)

---

## License

MIT
