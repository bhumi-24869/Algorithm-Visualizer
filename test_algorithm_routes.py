import requests

BASE_URL = "http://127.0.0.1:5000/api/algorithms"

# TEST POST
data = {
    "name": "Linear Search",
    "category": "Searching",
    "description": "Searches elements one by one",
    "time_complexity": "O(n)",
    "space_complexity": "O(1)"
}

post_response = requests.post(BASE_URL, json=data)

print("POST STATUS:", post_response.status_code)
print(post_response.json())


# TEST GET
get_response = requests.get(BASE_URL)

print("\nGET STATUS:", get_response.status_code)
print(get_response.json())
