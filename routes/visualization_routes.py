import subprocess
import json
from pathlib import Path
from flask import Blueprint, request, jsonify, session
from Database.db import db
from datetime import datetime, timezone

# Project directories
BASE_DIR = Path(__file__).resolve().parents[1]
CPP_DIR = BASE_DIR / "Backend"
CPP_EXECUTABLE = CPP_DIR / "algorithm_runner.exe"

# MongoDB collection
history_collection = db["visualization_history"]
visualization_bp = Blueprint("visualization", __name__)

def execute_cpp(algorithm, input_data):
    # Frontend names mapped to C++ names
    algorithm_map = {
        "Binary Search": "binarySearch",
        "Linear Search": "linearSearch",
        "Bubble Sort": "bubbleSort",
        "Insertion Sort": "insertionSort",
        "Merge Sort": "mergeSort",
        "Quick Sort": "quickSort",
        "Selection Sort": "selectionSort",
        "Tower of Hanoi": "tower"
    }

    if algorithm not in algorithm_map:
        raise ValueError("Unsupported algorithm")

    cpp_algorithm = algorithm_map[algorithm]

    # Tower of Hanoi uses disk count instead of an array
    if algorithm == "Tower of Hanoi":
        disks = input_data.get("disks")

        if type(disks) is not int or not 1 <= disks <= 12:
            raise ValueError("Disk count must be between 1 and 12")

        command = [
            str(CPP_EXECUTABLE),
            cpp_algorithm,
            str(disks)
        ]

    else:
        arr = input_data.get("array")

        if not isinstance(arr, list) or not arr:
            raise ValueError("A non-empty array is required")

        if len(arr) > 1000 or any(type(x) is not int for x in arr):
            raise ValueError("Array must contain up to 1000 integers")

        # Binary Search requires sorted input
        if algorithm == "Binary Search" and arr != sorted(arr):
            raise ValueError("Binary Search requires a sorted array")

        array_string = ",".join(map(str, arr))

        command = [
            str(CPP_EXECUTABLE),
            cpp_algorithm,
            array_string
        ]

        # Both search algorithms require a target
        if algorithm in ["Binary Search", "Linear Search"]:
            target = input_data.get("target")

            if type(target) is not int:
                raise ValueError("A valid integer target is required")

            command.append(str(target))

    # Run C++ executable
    result = subprocess.run(
        command,
        capture_output=True,
        text=True,
        cwd=str(CPP_DIR),
        timeout=10,
        check=False
    )

    if result.returncode != 0:
        print("C++ Error:", result.stderr)
        raise RuntimeError("C++ algorithm execution failed")

    output = json.loads(result.stdout)

    if not isinstance(output, dict) or "steps" not in output:
        raise RuntimeError("Invalid response from C++ program")

    return output


@visualization_bp.route("/visualize", methods=["POST"])
def visualize():
    # Require login
    user_id = session.get("user_id")

    if not user_id:
        return jsonify({
            "error": "Please log in first"
        }), 401

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
        execution_result = execute_cpp(
            algorithm_name,
            input_data
        )

        # Save history with the logged-in user's ID
        history_record = {
            "user_id": user_id,
            "algorithm_name": algorithm_name,
            "input_data": input_data,
            "steps": execution_result["steps"],
            "status": "completed",
            "created_at": datetime.now(timezone.utc)
        }

        result = history_collection.insert_one(history_record)

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
