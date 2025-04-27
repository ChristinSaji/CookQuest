import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "app")))

from bson import ObjectId
from database import db

challenges_collection = db["challenges"]

challenges = [
    {
        "meal_id": ObjectId("680a0bc15a6935b9eda4c310"),
        "user_id": ObjectId("68028a085fa0df88c3402a4f"),
    },

]

result = challenges_collection.insert_many(challenges)

print(f"Inserted {len(result.inserted_ids)} challenge documents!")
