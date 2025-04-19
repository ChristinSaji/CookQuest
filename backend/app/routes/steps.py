from fastapi import APIRouter, UploadFile, File, Form, Depends
from datetime import datetime, timezone
from app.dependencies import get_current_user
from app.models import StepValidationResponse
from app.database import db
from app.utils.gcs_uploader import upload_to_gcs

router = APIRouter()
user_steps_collection = db["user_steps"]

@router.post("/validate-step/", response_model=StepValidationResponse)
async def validate_step(
    step_index: int = Form(...),
    file: UploadFile = File(...),
    user=Depends(get_current_user)
):
    contents = await file.read()
    file.file.seek(0)

    print(f"User: {user['email']} | Step: {step_index} | Size: {len(contents)} bytes")

    image_url = upload_to_gcs(file, user["email"], step_index)

    user_steps_collection.update_one(
        {
            "user_id": str(user["_id"]),
            "step_index": step_index
        },
        {
            "$set": {
                "email": user["email"],
                "timestamp": datetime.now(timezone.utc),
                "validated": True,
                "image_url": image_url,
                "image_size": len(contents)
            }
        },
        upsert=True
    )

    return {"success": True, "step_index": step_index}
