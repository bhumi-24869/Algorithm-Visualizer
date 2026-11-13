import requests

# Create a session
s = requests.Session()

# Login
login_url = "http://127.0.0.1:5000/api/login"

login_data = {
    "email": "testuser@example.com",
    "password": "TestPassword123"
}

login_response = s.post(login_url, json=login_data)

if login_response.status_code == 200:

    print("Login successful!")

    # Access profile
    profile_url = "http://127.0.0.1:5000/api/profile"

    profile_response = s.get(profile_url)

    print("Profile Status:", profile_response.status_code)
    print("Profile Details:", profile_response.json())

else:
    print("Login failed:", login_response.json())
