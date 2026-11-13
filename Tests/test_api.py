import requests

url = "http://127.0.0.1:5000/api/algorithms"

data = {
    "name": "Linear Search",
    "category": "Searching",
    "description": "Finds an element by checking each element",
    "time_complexity": "O(n)",
    "space_complexity": "O(1)"
}

response = requests.post(url, json=data)

print("Status Code:", response.status_code)
print("Response:", response.json())
