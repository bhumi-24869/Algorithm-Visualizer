from flask import Blueprint, jsonify
from Database.db import db
from bson import ObjectId
from bson.errors import InvalidId
from datetime import timezone

history_bp = Blueprint("history", __name__)
history_collection = db["visualization_history"]

def format_history_record(record):
    record["_id"] = str(record["_id"])
    created_at = record.get("created_at")

    if created_at is not None:

        if created_at.tzinfo is None:
            created_at = created_at.replace(
                tzinfo=timezone.utc
            )

        record["created_at"] = created_at.isoformat()

    return record

@history_bp.route("/history", methods=["GET"])
def get_history():
    history = list(
        history_collection.find().sort([
            ("created_at", -1),
            ("_id", -1)
        ])
    )

    history = [
        format_history_record(record)
        for record in history
    ]

    return jsonify(history), 200


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

    record = format_history_record(record)

    return jsonify(record), 200
