from flask import Blueprint, request, jsonify
from Database.db import db
from bson import ObjectId
from bson.errors import InvalidId

algorithm_bp = Blueprint("algorithm", __name__)

algorithm_collection = db["algorithms"]

@algorithm_bp.route("/algorithms", methods=["GET"])
def get_algorithms():
    algorithms = list(algorithm_collection.find())

    for algorithm in algorithms:
        algorithm["_id"] = str(algorithm["_id"])

    return jsonify(algorithms), 200


@algorithm_bp.route("/algorithms", methods=["POST"])
def add_algorithm():
    data = request.get_json(silent=True)

    if not data:
        return jsonify({"error": "JSON data is required"}), 400

    name = data.get("name")
    category = data.get("category")

    if not name or not category:
        return jsonify({
            "error": "Name and category are required"
        }), 400

    algorithm = {
        "name": name,
        "category": category,
        "description": data.get("description", ""),
        "time_complexity": data.get("time_complexity", ""),
        "space_complexity": data.get("space_complexity", "")
    }

    result = algorithm_collection.insert_one(algorithm)

    return jsonify({
        "message": "Algorithm added successfully",
        "id": str(result.inserted_id)
    }), 201


@algorithm_bp.route("/algorithms/<algorithm_id>", methods=["GET"])
def get_algorithm(algorithm_id):
    try:
        algorithm = algorithm_collection.find_one({
            "_id": ObjectId(algorithm_id)
        })
    except InvalidId:
        return jsonify({"error": "Invalid algorithm ID"}), 400

    if algorithm is None:
        return jsonify({"error": "Algorithm not found"}), 404

    algorithm["_id"] = str(algorithm["_id"])

    return jsonify(algorithm), 200
