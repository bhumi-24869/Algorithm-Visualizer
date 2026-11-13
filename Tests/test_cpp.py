import requests

url = "http://127.0.0.1:5000/api/visualize"

data = {
    "algorithm_name": "Bubble Sort",
    "input_data": {
        "array": [5, 3, 8, 1, 2]
    }
}

response = requests.post(url, json=data)

print("Status:", response.status_code)
print(response.json())