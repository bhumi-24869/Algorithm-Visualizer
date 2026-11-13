import requests

algorithm_id = "PASTE_YOUR_ALGORITHM_ID_HERE"

url = f"http://127.0.0.1:5000/api/algorithms/{algorithm_id}"

data = {
    "description": "Updated algorithm description",
    "time_complexity": "O(log n)"
}

response = requests.put(url, json=data)

print("Status Code:", response.status_code)
print("Response:", response.json())
