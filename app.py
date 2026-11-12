from flask import Flask, jsonify
from Database.db import db, check_connection
from routes.algorithm_routes import algorithm_bp
from routes.visualization_routes import visualization_bp

app = Flask(__name__)

app.register_blueprint(algorithm_bp, url_prefix="/api")
app.register_blueprint(visualization_bp, url_prefix="/api")

@app.route("/")
def home():
    if check_connection():
        return jsonify({
            "message": "Flask and MongoDB connected successfully!",
            "database": db.name,
            "status": "connected"
        })

    return jsonify({
        "message": "Database connection failed",
        "status": "disconnected"
    }), 500


if __name__ == "__main__":
    app.run(debug=True)
