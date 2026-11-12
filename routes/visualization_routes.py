from flask import Blueprint, request, jsonify
from Database.db import db

visualization_bp = Blueprint("visualization", __name__)
history_collection = db["visualization_history"]

# POST: Receive visualization input
@visualization_bp.route("/visualize", methods=["POST"])
def visualize():
    data = request.get_json(silent=True)

    if not data:
        return jsonify({
            "error": "JSON data is required"
        }), 400

    algorithm_name = data.get("algorithm_name")
    input_data = data.get("input_data")

    if not algorithm_name or input_data is None:
        return jsonify({
            "error": "Algorithm name and input data are required"
        }), 400

    # Store the request in MongoDB
    visualization = {
        "algorithm_name": algorithm_name,
        "input_data": input_data,
        "status": "pending"
    }

    result = history_collection.insert_one(visualization)

    return jsonify({
        "message": "Visualization request received successfully",
        "request_id": str(result.inserted_id),
        "algorithm": algorithm_name,
        "status": "pending",
        "note": "C++ execution integration is pending"
    }), 202
