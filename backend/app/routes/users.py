from fastapi import APIRouter, HTTPException, Depends
from app.models import (
    UserCreate, UserLogin, UserResponse, PasswordResetRequest,
    PasswordResetConfirm, TokenResponse, MessageResponse, UserUpdateRequest
)
from app.database import users_collection
from app.auth import hash_password, verify_password, create_access_token, create_password_reset_token
from app.utils.email import send_reset_email
from app.dependencies import get_current_user
from datetime import timedelta
import jwt
import os

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"

router = APIRouter()

@router.post("/signup", response_model=UserResponse)
def signup(user: UserCreate):
    existing_user = users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = hash_password(user.password)
    user_dict = {
        "name": user.name,
        "email": user.email,
        "password": hashed_password,
        "gender": None,
        "age": None,
        "height": None,
        "weight": None,
        "bedtime": None,
    }
    result = users_collection.insert_one(user_dict)

    return {"id": str(result.inserted_id), "name": user.name, "email": user.email}

@router.post("/login", response_model=TokenResponse)
def login(user: UserLogin):
    existing_user = users_collection.find_one({"email": user.email})
    if not existing_user or not verify_password(user.password, existing_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token = create_access_token(
        data={"sub": existing_user["email"]},
        expires_delta=timedelta(minutes=30)
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/forgot-password", response_model=MessageResponse)
def forgot_password(payload: PasswordResetRequest):
    user = users_collection.find_one({"email": payload.email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    token = create_password_reset_token(user["email"])
    send_reset_email(payload.email, token)
    return {"message": "Reset link sent to email"}

@router.post("/reset-password", response_model=MessageResponse)
def reset_password(payload: PasswordResetConfirm):
    try:
        decoded = jwt.decode(payload.token, SECRET_KEY, algorithms=[ALGORITHM])
        email = decoded["sub"]
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=400, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=400, detail="Invalid token")

    hashed_pw = hash_password(payload.new_password)
    result = users_collection.update_one({"email": email}, {"$set": {"password": hashed_pw}})
    if result.modified_count == 0:
        raise HTTPException(status_code=400, detail="Password reset failed")

    return {"message": "Password reset successful"}

@router.get("/user/me", response_model=dict)
async def get_profile(user=Depends(get_current_user)):
    user_info = {
        "name": user.get("name"),
        "email": user.get("email"),
        "gender": user.get("gender"),
        "age": user.get("age"),
        "height": user.get("height"),
        "weight": user.get("weight"),
        "bedtime": user.get("bedtime"),
    }
    return user_info

@router.put("/user/update-profile", response_model=MessageResponse)
async def update_profile(
    user_update: UserUpdateRequest,
    user=Depends(get_current_user)
):
    update_data = {k: v for k, v in user_update.dict().items() if v is not None}

    if not update_data:
        return {"message": "No data to update"}

    users_collection.update_one(
        {"_id": user["_id"]},
        {"$set": update_data}
    )

    return {"message": "Profile updated successfully"}
