import requests

algorithm_id = "PASTE_YOUR_TEST_ALGORITHM_ID_HERE"

url = f"http://127.0.0.1:5000/api/algorithms/{algorithm_id}"

response = requests.delete(url)

print("Status Code:", response.status_code)
print("Response:", response.json())
