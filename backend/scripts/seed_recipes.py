import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "app")))

from database import db

common_ingredients = [
    {"id": "1", "name": "Strawberries", "quantity": "400 grams", "image": "/static/images/strawberry.png"},
    {"id": "2", "name": "Apples", "quantity": "2", "image": "/static/images/apple.png"},
    {"id": "3", "name": "Bananas", "quantity": "2", "image": "/static/images/banana.png"},
    {"id": "4", "name": "Kiwifruits", "quantity": "3", "image": "/static/images/kiwi.png"},
]

common_nutrients = [
    {"id": "1", "name": "Calories", "value": "142"},
    {"id": "2", "name": "Fat", "value": "20 g"},
    {"id": "3", "name": "Fiber", "value": "6 g"},
    {"id": "4", "name": "Vitamin", "value": "2 mcg"},
    {"id": "5", "name": "Iron", "value": "4 mg"},
]

recipes = [
    {
        "name": "Meal 1",
        "image": "/static/images/meal1.png",
        "rating": 4,
        "bgColor": "#C9BBC7",
        "category": "Breakfast",
        "ingredients": common_ingredients,
        "nutrients": common_nutrients,
    },
    {
        "name": "Meal 2",
        "image": "/static/images/meal2.png",
        "rating": 3,
        "bgColor": "#BDCB90",
        "category": "Lunch",
        "ingredients": common_ingredients,
        "nutrients": common_nutrients,
    },
    {
        "name": "Fresh Fruit Salad",
        "image": "/static/images/meal3.png",
        "rating": 5,
        "bgColor": "#D7E0E6",
        "category": "Lunch",
        "ingredients": common_ingredients,
        "nutrients": common_nutrients,
    },
    {
        "name": "Caesar’s Salad",
        "image": "/static/images/meal4.png",
        "rating": 4,
        "bgColor": "#F8DF9F",
        "category": "Dinner",
        "ingredients": common_ingredients,
        "nutrients": common_nutrients,
    },
    {
        "name": "Vegan Delight",
        "image": "/static/images/meal5.png",
        "rating": 5,
        "bgColor": "#FFE459",
        "category": "Dinner",
        "ingredients": common_ingredients,
        "nutrients": common_nutrients,
    },
    {
        "name": "Protein Bowl",
        "image": "/static/images/meal6.png",
        "rating": 4,
        "bgColor": "#B1F89F",
        "category": "Supper",
        "ingredients": common_ingredients,
        "nutrients": common_nutrients,
    },
]

db["recipes"].insert_many(recipes)

print("Recipes seeded successfully.")
