"""
MindHealthCheck — Python ML Service
Entry point. Registers all blueprints and starts Flask.
"""
from flask import Flask
from flask_cors import CORS

from routes.upload import upload_bp
from routes.predict import predict_bp
from routes.chat import chat_bp
from routes.ai_config import ai_bp

app = Flask(__name__)
CORS(app)

# Register blueprints
app.register_blueprint(upload_bp)
app.register_blueprint(predict_bp)
app.register_blueprint(chat_bp)
app.register_blueprint(ai_bp)

if __name__ == "__main__":
    app.run(debug=True, port=5000)
