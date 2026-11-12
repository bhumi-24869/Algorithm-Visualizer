import requests

url = "http://127.0.0.1:5000/api/visualize"

data = {
    "algorithm_name": "Binary Search",
    "input_data": {
        "array": [10, 20, 30, 40, 50],
        "target": 30
    }
}

response = requests.post(url, json=data)

print("Status Code:", response.status_code)
print("Response:", response.json())
