from fastapi import APIRouter, Query, Depends, HTTPException
from bson import ObjectId
from app.database import db
from app.dependencies import get_current_user
from app.models import RecipeResponse
from typing import List

router = APIRouter()
recipes_collection = db["recipes"]

@router.get("/recipes", response_model=List[RecipeResponse])
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
            "category": recipe["category"],
            "ingredients": recipe.get("ingredients", []),
            "nutrients": recipe.get("nutrients", [])
        })

    return recipes

@router.get("/recipes/{recipe_id}", response_model=RecipeResponse)
def get_recipe(recipe_id: str, user=Depends(get_current_user)):
    recipe = recipes_collection.find_one({"_id": ObjectId(recipe_id)})
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")

    return {
        "id": str(recipe["_id"]),
        "name": recipe["name"],
        "image": recipe["image"],
        "rating": recipe["rating"],
        "bgColor": recipe["bgColor"],
        "category": recipe["category"],
        "ingredients": recipe.get("ingredients", []),
        "nutrients": recipe.get("nutrients", [])
    }
