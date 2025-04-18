from fastapi import APIRouter, Query, Depends
from app.database import db
from app.dependencies import get_current_user

router = APIRouter()
recipes_collection = db["recipes"]

@router.get("/recipes")
def get_recipes(category: str = Query(None), user=Depends(get_current_user)):
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
