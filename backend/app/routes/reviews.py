from fastapi import APIRouter, Depends, HTTPException
from app.models import ReviewCreate
from app.dependencies import get_current_user
from app.database import db
from datetime import datetime, timezone

router = APIRouter()
reviews_collection = db["reviews"]

@router.post("/review")
def submit_review(payload: ReviewCreate, user=Depends(get_current_user)):
    review_data = {
        "email": user["email"],
        "rating": payload.rating,
        "review": payload.review,
        "meal_id": payload.meal_id,
        "timestamp": datetime.now(timezone.utc)
    }

    result = reviews_collection.insert_one(review_data)
    if not result.inserted_id:
        raise HTTPException(status_code=500, detail="Failed to save review")

    return {"message": "Review submitted successfully"}
