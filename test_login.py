import requests

url = "http://127.0.0.1:5000/api/login"

data = {
    "email": "testuser@example.com",
    "password": "TestPassword123"
}

response = requests.post(url, json=data)

print("Status Code:", response.status_code)
print("Response:", response.json())

if response.status_code == 200:
    print("Login successful!")
else:
    print("Login failed!")
