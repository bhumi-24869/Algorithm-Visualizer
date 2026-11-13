import requests

BASE_URL = "http://127.0.0.1:5000/api"
client = requests.Session()

# Login
login = client.post(
    f"{BASE_URL}/login",
    json={
        "email": "shee123@gmail.com",
        "password": "pssword@123"
    }
)

print("LOGIN:", login.status_code)

if login.status_code != 200:
    print(login.json())
    exit()

# Get all history
response = client.get(f"{BASE_URL}/history")

print("\nHISTORY:", response.status_code)
print(response.json())

# Get one history record
if response.status_code == 200 and response.json():
    history_id = response.json()[0]["_id"]

    single_response = client.get(
        f"{BASE_URL}/history/{history_id}"
    )

    print("\nSINGLE HISTORY:", single_response.status_code)
    print(single_response.json())

# Logout
client.post(f"{BASE_URL}/logout")