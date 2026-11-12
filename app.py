from flask import Flask, jsonify
from flask_cors import CORS

from Database.db import (
    db,
    check_connection,
    create_indexes
)

from routes.algorithm_routes import algorithm_bp
from routes.visualization_routes import visualization_bp
from routes.history_routes import history_bp

app = Flask(__name__)

CORS(app, resources={
    r"/api/*": {"origins": "*"}
})

app.register_blueprint(algorithm_bp, url_prefix="/api")
app.register_blueprint(visualization_bp, url_prefix="/api")
app.register_blueprint(history_bp, url_prefix="/api")

@app.route("/")
def home():
    if check_connection():
        return jsonify({
            "message": "Flask and MongoDB connected successfully!",
            "database": db.name,
            "status": "connected"
        }), 200

    return jsonify({
        "message": "Database connection failed",
        "status": "disconnected"
    }), 500


if __name__ == "__main__":
    if check_connection():
        create_indexes()
    app.run(debug=True, use_reloader=False)