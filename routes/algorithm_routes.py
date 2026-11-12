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

    if not isinstance(data, dict):
        return jsonify({"error": "Valid JSON object is required"}), 400

    name = data.get("name")
    category = data.get("category")

    if not isinstance(name, str) or not name.strip():
        return jsonify({"error": "Valid name is required"}), 400

    if not isinstance(category, str) or not category.strip():
        return jsonify({"error": "Valid category is required"}), 400

    optional_fields = [
        "description",
        "time_complexity",
        "space_complexity"
    ]

    for field in optional_fields:
        if field in data and not isinstance(data[field], str):
            return jsonify({
                "error": f"{field} must be a string"
            }), 400

    algorithm = {
        "name": name.strip(),
        "category": category.strip(),
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


@algorithm_bp.route("/algorithms/<algorithm_id>", methods=["PUT"])
def update_algorithm(algorithm_id):

    try:
        object_id = ObjectId(algorithm_id)

    except InvalidId:
        return jsonify({"error": "Invalid algorithm ID"}), 400

    data = request.get_json(silent=True)

    if not isinstance(data, dict) or not data:
        return jsonify({"error": "Valid JSON data is required"}), 400

    allowed_fields = [
        "name",
        "category",
        "description",
        "time_complexity",
        "space_complexity"
    ]

    if set(data.keys()) - set(allowed_fields):
        return jsonify({"error": "Invalid field provided"}), 400

    for field, value in data.items():

        if not isinstance(value, str):
            return jsonify({
                "error": f"{field} must be a string"
            }), 400

        if field in ["name", "category"] and not value.strip():
            return jsonify({
                "error": f"{field} cannot be empty"
            }), 400

    updated_data = {
        field: value.strip()
        for field, value in data.items()
    }

    result = algorithm_collection.update_one(
        {"_id": object_id},
        {"$set": updated_data}
    )

    if result.matched_count == 0:
        return jsonify({"error": "Algorithm not found"}), 404

    return jsonify({
        "message": "Algorithm updated successfully"
    }), 200


@algorithm_bp.route("/algorithms/<algorithm_id>", methods=["DELETE"])
def delete_algorithm(algorithm_id):

    try:
        object_id = ObjectId(algorithm_id)

    except InvalidId:
        return jsonify({"error": "Invalid algorithm ID"}), 400

    result = algorithm_collection.delete_one({
        "_id": object_id
    })

    if result.deleted_count == 0:
        return jsonify({"error": "Algorithm not found"}), 404

    return jsonify({
        "message": "Algorithm deleted successfully"
    }), 200
