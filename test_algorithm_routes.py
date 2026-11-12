import requests

BASE_URL = "http://127.0.0.1:5000/api/algorithms"

# TEST POST
data = {
    "algorithm_name": "Binary Search",
    "input_data": "hello"
}

post_response = requests.post(BASE_URL, json=data)

print("POST STATUS:", post_response.status_code)
print(post_response.json())


# TEST GET
get_response = requests.get(BASE_URL)

print("\nGET STATUS:", get_response.status_code)
print(get_response.json())
