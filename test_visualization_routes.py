import requests

BASE_URL = "http://127.0.0.1:5000/api"

# Create a session to preserve login cookies
client = requests.Session()

# REGISTER
register_data = {
    "name": "Test User",
    "email": "shee123@gmail.com",
    "password": "pssword@123"
}

register_response = client.post(
    f"{BASE_URL}/register",
    json=register_data
)

print("REGISTER:", register_response.status_code)
print(register_response.json())

login_data = {
    "email": "shee123@gmail.com",
    "password": "pssword@123"
}

login_response = client.post(
    f"{BASE_URL}/login",
    json=login_data
)

print("LOGIN:", login_response.status_code)
print(login_response.json())

if login_response.status_code != 200:
    print("Login failed. Check your credentials.")
    exit()

visualization_data = {
    "algorithm_name": "Bubble Sort",
    "input_data": {
        "array": [50, 20, 40, 10, 30]
    }
}

response = client.post(
    f"{BASE_URL}/visualize",
    json=visualization_data
)

print("\nVISUALIZATION:", response.status_code)
print(response.json())

logout_response = client.post(
    f"{BASE_URL}/logout"
)

print("\nLOGOUT:", logout_response.status_code)
print(logout_response.json())
