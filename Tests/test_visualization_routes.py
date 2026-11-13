
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

# All algorithms and their inputs
tests = [
    {
        "algorithm_name": "Binary Search",
        "input_data": {"array": [10, 20, 30, 40, 50], "target": 30}
    },
    {
        "algorithm_name": "Linear Search",
        "input_data": {"array": [10, 20, 30, 40, 50], "target": 30}
    },
    {
        "algorithm_name": "Bubble Sort",
        "input_data": {"array": [50, 20, 40, 10, 30]}
    },
    {
        "algorithm_name": "Insertion Sort",
        "input_data": {"array": [50, 20, 40, 10, 30]}
    },
    {
        "algorithm_name": "Merge Sort",
        "input_data": {"array": [50, 20, 40, 10, 30]}
    },
    {
        "algorithm_name": "Quick Sort",
        "input_data": {"array": [50, 20, 40, 10, 30]}
    },
    {
        "algorithm_name": "Selection Sort",
        "input_data": {"array": [50, 20, 40, 10, 30]}
    },
    {
        "algorithm_name": "Tower of Hanoi",
        "input_data": {"disks": 3}
    }
]

# Test each algorithm
for test in tests:

    response = client.post(
        f"{BASE_URL}/visualize",
        json=test
    )

    print("\n-------------------------")
    print("ALGORITHM:", test["algorithm_name"])
    print("STATUS:", response.status_code)

    result = response.json()

    if response.status_code == 200:
        print("History ID:", result.get("history_id"))
        print("Number of steps:", len(result.get("steps", [])))
    else:
        print("ERROR:", result)

# Logout
client.post(f"{BASE_URL}/logout")
