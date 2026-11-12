from flask import Blueprint, jsonify
from Database.db import db
from bson import ObjectId
from bson.errors import InvalidId

history_bp = Blueprint("history", __name__)
history_collection = db["visualization_history"]

# GET: Fetch all execution history
@history_bp.route("/history", methods=["GET"])
def get_history():
    history = list(
        history_collection.find().sort("_id", -1)
    )

    for record in history:
        record["_id"] = str(record["_id"])

    return jsonify(history), 200


# GET: Fetch one history record by ID
@history_bp.route("/history/<history_id>", methods=["GET"])
def get_history_by_id(history_id):
    try:
        record = history_collection.find_one({
            "_id": ObjectId(history_id)
        })

    except InvalidId:
        return jsonify({
            "error": "Invalid history ID"
        }), 400

    if record is None:
        return jsonify({
            "error": "History record not found"
        }), 404

    record["_id"] = str(record["_id"])

    return jsonify(record), 200
