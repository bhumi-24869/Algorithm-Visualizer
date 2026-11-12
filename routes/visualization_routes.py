from flask import Blueprint, request, jsonify
from Database.db import db
from datetime import datetime, timezone

visualization_bp = Blueprint("visualization", __name__)
history_collection = db["visualization_history"]


@visualization_bp.route("/visualize", methods=["POST"])
def visualize():
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({
            "error": "Valid JSON object is required"
        }), 400

    algorithm_name = data.get("algorithm_name")
    input_data = data.get("input_data")

    if not isinstance(algorithm_name, str) or not algorithm_name.strip():
        return jsonify({
            "error": "Algorithm name must be a non-empty string"
        }), 400

    if not isinstance(input_data, dict):
        return jsonify({
            "error": "Input data must be a JSON object"
        }), 400

    visualization = {
        "algorithm_name": algorithm_name.strip(),
        "input_data": input_data,
        "status": "pending",
        "created_at": datetime.now(timezone.utc)
    }

    result = history_collection.insert_one(visualization)

    return jsonify({
        "message": "Visualization request received successfully",
        "request_id": str(result.inserted_id),
        "algorithm": algorithm_name.strip(),
        "status": "pending",
        "note": "C++ execution integration is pending"
    }), 202
