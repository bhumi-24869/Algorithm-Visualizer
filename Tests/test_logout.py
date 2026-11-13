import requests

s = requests.Session()

login_url = "http://127.0.0.1:5000/api/login"

login_data = {
    "email": "testuser@example.com",
    "password": "TestPassword123"
}

# Login
login_response = s.post(login_url, json=login_data)

if login_response.status_code == 200:

    print("Login successful!")

    # Logout
    logout_response = s.post(
        "http://127.0.0.1:5000/api/logout"
    )

    print("Logout Status:", logout_response.status_code)
    print("Logout Response:", logout_response.json())

    # Try accessing profile after logout
    profile_response = s.get(
        "http://127.0.0.1:5000/api/profile"
    )

    print("Profile After Logout:", profile_response.status_code)
    print(profile_response.json())

else:
    print("Login failed!")
