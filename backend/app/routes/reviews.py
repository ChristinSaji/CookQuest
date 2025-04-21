from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from bson import ObjectId
from app.dependencies import get_current_user
from app.database import db, recipes_collection
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
        "name": user.get("name", user["email"].split("@")[0]),
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

@router.get("/reviews")
def get_reviews(limit: int = 20):
    reviews = list(reviews_collection.find().sort("timestamp", -1).limit(limit))

    for review in reviews:
        review["_id"] = str(review["_id"])
        review["meal_name"] = "Unknown Meal"

        if review.get("meal_id"):
            try:
                recipe = recipes_collection.find_one({"_id": ObjectId(review["meal_id"])})
                if recipe:
                    review["meal_name"] = recipe.get("name", "Unknown Meal")
            except:
                pass

    return reviews
