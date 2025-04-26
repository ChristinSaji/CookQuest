from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from datetime import datetime, timezone
from bson import ObjectId
from app.dependencies import get_current_user
from app.models import StepValidationResponse
from app.database import db
from app.utils.gcs_uploader import upload_to_gcs
from app.utils.llm_evaluator import evaluate_step_with_llm

router = APIRouter()
meal_steps_collection = db["meal_steps"]
user_steps_collection = db["user_steps"]
recipes_collection = db["recipes"]

@router.get("/meal-steps/{meal_id}")
def get_meal_steps(meal_id: str):
    meal = meal_steps_collection.find_one({"meal_id": meal_id})
    if not meal:
        raise HTTPException(status_code=404, detail="Meal steps not found")
    return {"meal_id": meal_id, "steps": meal["steps"]}

@router.post("/validate-step/", response_model=StepValidationResponse)
async def validate_step(
    step_index: int = Form(...),
    meal_id: str = Form(...),
    file: UploadFile = File(...),
    user=Depends(get_current_user)
):
    contents = await file.read()
    file.file.seek(0)

    print(f"Validating step | User: {user['email']} | Meal: {meal_id} | Step: {step_index} | Size: {len(contents)} bytes")

    image_url = upload_to_gcs(file, user["email"], meal_id, step_index)

    meal_steps_doc = meal_steps_collection.find_one({"meal_id": meal_id})
    if not meal_steps_doc or step_index >= len(meal_steps_doc["steps"]):
        raise HTTPException(status_code=404, detail="Step description not found")

    all_steps = meal_steps_doc["steps"]
    current_step = all_steps[step_index]

    meal_info_doc = recipes_collection.find_one({"_id": ObjectId(meal_id)})
    if not meal_info_doc:
        raise HTTPException(status_code=404, detail="Meal info not found")

    meal_name = meal_info_doc["name"]
    ingredients_list = [ingredient["name"] for ingredient in meal_info_doc.get("ingredients", [])]

    feedback, score = evaluate_step_with_llm(
        image_url=image_url,
        meal_name=meal_name,
        ingredients_list=ingredients_list,
        all_steps=all_steps,
        current_step_index=step_index
    )

    existing = user_steps_collection.find_one({
        "user_id": str(user["_id"]),
        "meal_id": meal_id,
        "step_index": step_index
    })

    is_new_session = not existing or existing.get("timestamp") is None
    timestamp = datetime.now(timezone.utc) if is_new_session else existing["timestamp"]

    user_steps_collection.update_one(
        {
            "user_id": str(user["_id"]),
            "meal_id": meal_id,
            "step_index": step_index
        },
        {
            "$set": {
                "email": user["email"],
                "timestamp": timestamp,
                "validated": True,
                "image_url": image_url,
                "image_size": len(contents),
                "step_description": current_step,
                "step_feedback": feedback,
                "step_score": score,
            }
        },
        upsert=True
    )

    return {
        "success": True,
        "step_index": step_index,
        "score": score,
        "feedback": feedback
    }
