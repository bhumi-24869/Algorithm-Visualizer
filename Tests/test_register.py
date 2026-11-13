import requests

url = "http://127.0.0.1:5000/api/register"

data = {
    "name": "Test User",
    "email": "testuser@example.com",
    "password": "TestPassword123"
}

response = requests.post(url, json=data)

print("Status Code:", response.status_code)
print("Response:", response.text)