
from flask import Flask, jsonify
from Database.db import db, check_connection

app = Flask(__name__)

@app.route('/')
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


if __name__ == '__main__':
    app.run(debug=True)
