import subprocess
import json
from pathlib import Path
from flask import Blueprint, request, jsonify
from Database.db import db
from datetime import datetime, timezone

# Main project directory
BASE_DIR = Path(__file__).resolve().parents[1]

# C++ backend directory
CPP_DIR = BASE_DIR / "Backend"

# Compiled C++ executable
CPP_EXECUTABLE = CPP_DIR / "algorithm_runner.exe"

history_collection = db["visualization_history"]
visualization_bp = Blueprint("visualization", __name__)

def execute_cpp(algorithm, input_data):
    # Map frontend algorithm names to C++ function names
    algorithm_map = {
        "Binary Search": "binarySearch",
        "Bubble Sort": "bubbleSort"
    }

    if algorithm not in algorithm_map:
        raise ValueError("Unsupported algorithm")

    cpp_algorithm = algorithm_map[algorithm]

    # Get array
    arr = input_data.get("array")

    if not isinstance(arr, list) or not arr:
        raise ValueError("A non-empty array is required")

    # Validate array elements
    if len(arr) > 1000 or any(
        type(x) is not int for x in arr
    ):
        raise ValueError("Array must contain up to 1000 integers")

    # Binary Search requires a sorted array
    if algorithm == "Binary Search" and arr != sorted(arr):
        raise ValueError("Binary Search requires a sorted array")

    # Convert array into comma-separated string
    array_string = ",".join(map(str, arr))

    # Construct command
    command = [
        str(CPP_EXECUTABLE),
        cpp_algorithm,
        array_string
    ]

    # Binary Search requires a target
    if algorithm == "Binary Search":
        target = input_data.get("target")

        if type(target) is not int:
            raise ValueError("A valid integer target is required")

        command.append(str(target))

    # Execute C++ program
    result = subprocess.run(
        command,
        capture_output=True,
        text=True,
        cwd=str(CPP_DIR),
        timeout=10,
        check=False
    )

    # Check execution result
    if result.returncode != 0:
        print("C++ Error:", result.stderr)
        raise RuntimeError("C++ algorithm execution failed")

    # Convert C++ JSON output into Python dictionary
    output = json.loads(result.stdout)

    return output


@visualization_bp.route("/visualize", methods=["POST"])
def visualize():
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({
            "error": "Valid JSON is required"
        }), 400

    algorithm_name = data.get("algorithm_name")
    input_data = data.get("input_data")

    if not isinstance(algorithm_name, str):
        return jsonify({
            "error": "Algorithm name is required"
        }), 400

    if not isinstance(input_data, dict):
        return jsonify({
            "error": "Input data must be an object"
        }), 400

    try:
        # Execute C++ algorithm
        execution_result = execute_cpp(
            algorithm_name,
            input_data
        )

        # Save execution in MongoDB
        history_record = {
            "algorithm_name": algorithm_name,
            "input_data": input_data,
            "steps": execution_result["steps"],
            "status": "completed",
            "created_at": datetime.now(timezone.utc)
        }

        result = history_collection.insert_one(
            history_record
        )

        return jsonify({
            "message": "Algorithm executed successfully",
            "history_id": str(result.inserted_id),
            "algorithm_name": algorithm_name,
            "steps": execution_result["steps"],
            "status": "completed"
        }), 200

    except ValueError as e:
        return jsonify({
            "error": str(e)
        }), 400

    except FileNotFoundError:
        return jsonify({
            "error": "C++ executable not found. Compile the C++ program first."
        }), 500

    except subprocess.TimeoutExpired:
        return jsonify({
            "error": "Algorithm execution timed out"
        }), 504

    except (RuntimeError, json.JSONDecodeError, KeyError) as e:
        print("Execution error:", e)
        return jsonify({
            "error": "Algorithm execution failed"
        }), 500
