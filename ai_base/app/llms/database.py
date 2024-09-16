from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from .env_setup import MONGO_URI

# Setup MongoDB connection
try:
    client = MongoClient(MONGO_URI)
    db = client["test"]
except ConnectionFailure as e:
    print(f"Failed to connect to MongoDB: {e}")
    db = None 

def get_chat_history_collection(prompt_type='general_assistant'):
    collection_name = f"chat_history_{prompt_type}"
    if collection_name not in db.list_collection_names():
        print(f"Creating new collection: {collection_name}")
    return db[collection_name]