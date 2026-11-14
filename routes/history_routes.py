from flask import Blueprint, jsonify, session
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


# GET ALL HISTORY OF LOGGED-IN USER
@history_bp.route("/history", methods=["GET"])
def get_history():

    user_id = session.get("user_id")

    if not user_id:
        return jsonify({
            "error": "Please log in first"
        }), 401

    history = list(
        history_collection.find({
            "user_id": user_id
        }).sort([
            ("created_at", -1),
            ("_id", -1)
        ])
    )

    history = [
        format_history_record(record)
        for record in history
    ]

    return jsonify(history), 200


# GET ONE HISTORY RECORD
@history_bp.route("/history/<history_id>", methods=["GET"])
def get_history_by_id(history_id):

    user_id = session.get("user_id")

    if not user_id:
        return jsonify({
            "error": "Please log in first"
        }), 401

    try:
        record = history_collection.find_one({
            "_id": ObjectId(history_id),
            "user_id": user_id
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


# DELETE ONE HISTORY RECORD
@history_bp.route("/history/<history_id>", methods=["DELETE"])
def delete_history(history_id):

    user_id = session.get("user_id")

    if not user_id:
        return jsonify({
            "error": "Please log in first"
        }), 401

    try:
        result = history_collection.delete_one({
            "_id": ObjectId(history_id),
            "user_id": user_id
        })

    except InvalidId:
        return jsonify({
            "error": "Invalid history ID"
        }), 400

    if result.deleted_count == 0:
        return jsonify({
            "error": "History record not found"
        }), 404

    return jsonify({
        "message": "History deleted successfully"
    }), 200


# DELETE ALL HISTORY OF LOGGED-IN USER
@history_bp.route("/history", methods=["DELETE"])
def clear_history():

    user_id = session.get("user_id")

    if not user_id:
        return jsonify({
            "error": "Please log in first"
        }), 401

    result = history_collection.delete_many({
        "user_id": user_id
    })

    return jsonify({
        "message": "History cleared successfully",
        "deleted_count": result.deleted_count
    }), 200