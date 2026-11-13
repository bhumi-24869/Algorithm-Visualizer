from flask import Blueprint, request, jsonify, session
from Database.db import db
from werkzeug.security import generate_password_hash, check_password_hash
from pymongo.errors import DuplicateKeyError
from bson import ObjectId

user_bp = Blueprint("user", __name__)
users_collection = db["users"]

# REGISTER
@user_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({"error": "Valid JSON required"}), 400

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not isinstance(name, str) or not name.strip():
        return jsonify({"error": "Name is required"}), 400

    if not isinstance(email, str):
        return jsonify({"error": "Email is required"}), 400

    email = email.strip().lower()

    if "@" not in email or "." not in email.split("@")[-1]:
        return jsonify({"error": "Invalid email"}), 400

    if not isinstance(password, str) or len(password) < 8:
        return jsonify({
            "error": "Password must contain at least 8 characters"
        }), 400

    user = {
        "name": name.strip(),
        "email": email,
        "password": generate_password_hash(password)
    }

    try:
        result = users_collection.insert_one(user)

    except DuplicateKeyError:
        return jsonify({
            "error": "Email already registered"
        }), 409

    return jsonify({
        "message": "Registration successful",
        "user_id": str(result.inserted_id)
    }), 201


# LOGIN
@user_bp.route("/login", methods=["POST"])
def login():

    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({"error": "Valid JSON required"}), 400

    email = data.get("email")
    password = data.get("password")

    if not isinstance(email, str) or not isinstance(password, str):
        return jsonify({"error": "Email and password required"}), 400

    email = email.strip().lower()

    user = users_collection.find_one({"email": email})

    if user is None or not check_password_hash(
        user["password"], password
    ):
        return jsonify({
            "error": "Invalid email or password"
        }), 401

    session.clear()
    session["user_id"] = str(user["_id"])

    return jsonify({
        "message": "Login successful",
        "user": {
            "id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"]
        }
    }), 200


# GET PROFILE
@user_bp.route("/profile", methods=["GET"])
def get_profile():

    user_id = session.get("user_id")

    if not user_id:
        return jsonify({"error": "Please log in"}), 401

    user = users_collection.find_one({
        "_id": ObjectId(user_id)
    })

    if user is None:
        session.clear()
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"]
    }), 200


# LOGOUT
@user_bp.route("/logout", methods=["POST"])
def logout():

    session.clear()

    return jsonify({
        "message": "Logged out successfully"
    }), 200
