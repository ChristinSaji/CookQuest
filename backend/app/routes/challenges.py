from fastapi import APIRouter, Depends
from app.database import challenges_collection, recipes_collection, users_collection
from app.dependencies import get_current_user

router = APIRouter()

@router.get("/challenges")
async def get_challenges():
    challenges = list(challenges_collection.find())

    response = []

    for challenge in challenges:
        meal = recipes_collection.find_one({"_id": challenge.get("meal_id")})
        user = users_collection.find_one({"_id": challenge.get("user_id")})

        if meal and user:
            response.append({
                "meal": {
                    "id": str(meal["_id"]),
                    "name": meal["name"],
                    "image": meal["image"],
                    "rating": meal.get("rating", 5),
                },
                "created_by": user["name"]
            })

    return response
