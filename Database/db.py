
from pymongo import MongoClient

MONGO_URI = "mongodb://localhost:27017/"

client = MongoClient(
    MONGO_URI,
    serverSelectionTimeoutMS=5000
)

db = client["algorithm_visualizer"]

def check_connection():
    try:
        client.admin.command("ping")
        return True
    except Exception as e:
        print("MongoDB connection failed:", e)
        return False
