from fastapi import APIRouter, Depends, HTTPException, Query
from app.dependencies import get_current_user
from app.database import db
from bson import ObjectId
from typing import Optional

router = APIRouter()
user_steps_collection = db["user_steps"]
recipes_collection = db["recipes"]

@router.get("/completion-summary/{meal_id}")
def get_completion_summary(
    meal_id: str,
    elapsed_time: Optional[int] = Query(None),
    user=Depends(get_current_user)
):
    user_id = str(user["_id"])

    meal = recipes_collection.find_one({"_id": ObjectId(meal_id)})
    if not meal:
        raise HTTPException(status_code=404, detail="Meal not found")

    steps_cursor = user_steps_collection.find({
        "user_id": user_id,
        "meal_id": meal_id,
        "validated": True
    }).sort("step_index", 1)

    steps = list(steps_cursor)
    if not steps:
        raise HTTPException(status_code=404, detail="No validated steps found")

    feedback_list = []
    total_score = 0

    for step in steps:
        feedback_list.append({
            "step_index": step.get("step_index"),
            "image_url": step.get("image_url"),
            "description": step.get("step_description", "Step description not available."),
            "feedback": step.get("step_feedback", "No feedback available"),
            "score": step.get("step_score", 0),
        })
        total_score += step.get("step_score", 0)

    if elapsed_time is not None:
        elapsed_seconds = elapsed_time
    else:
        elapsed_seconds = 0

    minutes = elapsed_seconds // 60
    seconds = elapsed_seconds % 60
    formatted_time = f"{minutes}m {seconds}s"

    return {
        "meal_name": meal["name"],
        "meal_id": meal_id,
        "total_score": total_score,
        "elapsed_time": formatted_time,
        "feedback": feedback_list
    }
