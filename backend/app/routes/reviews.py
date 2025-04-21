from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from app.dependencies import get_current_user
from app.database import db
from datetime import datetime, timezone
from typing import Optional
from app.utils.gcs_uploader import upload_review_image_to_gcs

router = APIRouter()
reviews_collection = db["reviews"]

@router.post("/review")
async def submit_review(
    rating: int = Form(...),
    review: Optional[str] = Form(""),
    meal_id: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    user=Depends(get_current_user),
):
    image_url = None

    if image:
        try:
            image_url = upload_review_image_to_gcs(image, user["email"])
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Image upload failed: {str(e)}")

    review_data = {
        "email": user["email"],
        "rating": rating,
        "review": review,
        "meal_id": meal_id,
        "image_url": image_url,
        "timestamp": datetime.now(timezone.utc)
    }

    result = reviews_collection.insert_one(review_data)
    if not result.inserted_id:
        raise HTTPException(status_code=500, detail="Failed to save review")

    return {"message": "Review submitted successfully"}
