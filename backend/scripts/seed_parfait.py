import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "app")))

from database import db

recipes_collection = db["recipes"]
meal_steps_collection = db["meal_steps"]

ingredients = [
    {"id": "1", "name": "Strawberries", "quantity": "1/2 cup", "image": "/static/images/strawberry.png"},
    {"id": "2", "name": "Bananas", "quantity": "1 small", "image": "/static/images/banana.png"},
    {"id": "3", "name": "Yogurt", "quantity": "1/2 cup", "image": "/static/images/meal6.png"},
    {"id": "4", "name": "Granola", "quantity": "2 tbsp", "image": "/static/images/meal5.png"},
    {"id": "5", "name": "Honey", "quantity": "1 tsp (optional)", "image": "/static/images/meal4.png"},
]

nutrients = [
    {"id": "1", "name": "Calories", "value": "200"},
    {"id": "2", "name": "Protein", "value": "5 g"},
    {"id": "3", "name": "Fiber", "value": "3 g"},
    {"id": "4", "name": "Calcium", "value": "15%"},
    {"id": "5", "name": "Vitamin C", "value": "20%"},
]

recipe = {
    "name": "Fruit Yogurt Parfait",
    "image": "/static/images/meal6.png",
    "rating": 4,
    "bgColor": "#FFEFD5",
    "category": "Breakfast",
    "estimated_time": 10,
    "calories": 200,
    "ingredients": ingredients,
    "nutrients": nutrients,
}

recipe_result = recipes_collection.insert_one(recipe)
recipe_id = str(recipe_result.inserted_id)

steps = [
    "Wash and slice strawberries and bananas.",
    "Layer yogurt and fruits alternately in a glass or bowl.",
    "Top with granola and honey. Serve chilled.",
]

meal_steps_collection.update_one(
    {"meal_id": recipe_id},
    {"$set": {"steps": steps}},
    upsert=True
)

print(f"Seeded 'Fruit Yogurt Parfait' with _id: {recipe_id}")
