from fastapi import APIRouter, Query
from app.database import db

router = APIRouter()

recipes_collection = db["recipes"]

@router.get("/recipes")
def get_recipes(category: str = Query(None)):
    query = {"category": category} if category else {}
    recipes = []
    for recipe in recipes_collection.find(query):
        recipes.append({
            "id": str(recipe["_id"]),
            "name": recipe["name"],
            "image": recipe["image"],
            "rating": recipe["rating"],
            "bgColor": recipe["bgColor"],
            "category": recipe["category"]
        })
    return recipes
