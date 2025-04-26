from fastapi import APIRouter, Depends, HTTPException
from app.dependencies import get_current_user
from app.database import db
from bson import ObjectId

router = APIRouter()
user_steps_collection = db["user_steps"]
recipes_collection = db["recipes"]
history_collection = db["cooking_history"]

@router.get("/history")
def get_user_history(user=Depends(get_current_user)):
    user_id = str(user["_id"])

    history_records = list(history_collection.find({"user_id": user_id}).sort("completed_at", -1))

    if not history_records:
        return []

    result = []
    for record in history_records:
        feedback_steps = []
        for step in record.get("steps", []):
            feedback_steps.append({
                "step_index": step.get("step_index"),
                "image_url": step.get("image_url"),
                "description": step.get("step_description", "No description available."),
                "feedback": step.get("step_feedback", "No feedback provided."),
                "score": step.get("step_score", 0),
            })

        result.append({
            "meal_id": record.get("meal_id"),
            "meal_name": record.get("meal_name"),
            "total_score": record.get("total_score", 0),
            "elapsed_time": record.get("elapsed_time", "0m 0s"),
            "completed_at": record.get("completed_at"),
            "steps": feedback_steps,
        })

    return result
