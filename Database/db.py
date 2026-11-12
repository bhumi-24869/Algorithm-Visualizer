
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

algorithms_collection = db["algorithms"]
history_collection = db["visualization_history"]


def create_indexes():
    # Speed up algorithm name searches
    algorithms_collection.create_index("name")

    # Speed up category searches
    algorithms_collection.create_index("category")

    # Speed up recent history searches using timestamps
    history_collection.create_index(
        [("created_at", -1)]
    )

    print("MongoDB indexes created successfully!")
