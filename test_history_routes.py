import requests

url = "http://127.0.0.1:5000/api/history"

response = requests.get(url)

print("Status Code:", response.status_code)
print("Execution History:")

for record in response.json():
    print("-------------------------")
    print("ID:", record["_id"])
    print("Algorithm:", record["algorithm_name"])
    print("Input:", record["input_data"])
    print("Status:", record["status"])
    print("Created At:", record.get("created_at", "Not available"))
