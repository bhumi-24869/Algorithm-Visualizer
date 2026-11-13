from flask import Flask, jsonify, session
from Database.db import db, check_connection, create_indexes
from routes.algorithm_routes import algorithm_bp
from routes.visualization_routes import visualization_bp
from routes.history_routes import history_bp
from routes.user_routes import user_bp
from flask_cors import CORS

import os

app = Flask(__name__)
CORS(
    app,
    origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500"
    ],
    supports_credentials=True
)

# Session configuration
app.config["SECRET_KEY"] = os.environ.get(
    "FLASK_SECRET_KEY",
    "development-secret-change-before-deployment"
)

app.config["SESSION_COOKIE_HTTPONLY"] = True
app.config["SESSION_COOKIE_SAMESITE"] = "Lax"

# Register routes
app.register_blueprint(algorithm_bp, url_prefix="/api")
app.register_blueprint(visualization_bp, url_prefix="/api")
app.register_blueprint(history_bp, url_prefix="/api")
app.register_blueprint(user_bp, url_prefix="/api")

@app.route("/")
def home():
    if check_connection():
        return jsonify({
            "message": "Flask and MongoDB connected successfully!",
            "database": db.name,
            "status": "connected"
        }), 200

    return jsonify({
        "message": "Database connection failed"
    }), 500


if __name__ == "__main__":
    if check_connection():
        create_indexes()
    app.run(debug=True, use_reloader=False)