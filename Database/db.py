
from pymongo import MongoClient

MONGO_URI = "mongodb://localhost:27017/"

client = MongoClient(
    MONGO_URI,
    serverSelectionTimeoutMS=5000
)

db = client["algorithm_visualizer"]

algorithms_collection = db["algorithms"]
history_collection = db["visualization_history"]
users_collection = db["users"]

def check_connection():
    try:
        client.admin.command("ping")
        return True

    except Exception as e:
        print("MongoDB connection failed:", e)
        return False


def create_indexes():
    algorithms_collection.create_index("name")

    algorithms_collection.create_index("category")

    history_collection.create_index(
        [("created_at", -1)]
    )

    users_collection.create_index(
    "email",
    unique=True
    )
    print("MongoDB indexes created successfully!")
