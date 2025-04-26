import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "app")))

from database import db

meal_steps_collection = db["meal_steps"]

meal_steps_data = [
    {
        "meal_id": "6804db8387b9de5f96a83925",
        "steps": [
            "Wash and chop all vegetables.",
            "Heat oil in a pan and sauté onions until golden brown.",
            "Add spices and cook for 2 minutes.",
            "Add vegetables and stir well.",
            "Simmer until vegetables are tender.",
            "Garnish with coriander and serve hot."
        ]
    }
]

for item in meal_steps_data:
    meal_steps_collection.update_one(
        {"meal_id": item["meal_id"]},
        {"$set": {"steps": item["steps"]}},
        upsert=True
    )

print("Meal steps seeded successfully.")
