from fastapi import APIRouter, HTTPException, Depends
from app.models import UserCreate, UserLogin, UserResponse
from app.database import users_collection
from app.auth import hash_password, verify_password, create_access_token
from bson.objectid import ObjectId
from datetime import timedelta

router = APIRouter()

@router.post("/signup", response_model=UserResponse)
def signup(user: UserCreate):
    existing_user = users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = hash_password(user.password)
    user_dict = {"name": user.name, "email": user.email, "password": hashed_password}
    result = users_collection.insert_one(user_dict)

    return {"id": str(result.inserted_id), "name": user.name, "email": user.email}

@router.post("/login")
def login(user: UserLogin):
    existing_user = users_collection.find_one({"email": user.email})
    if not existing_user or not verify_password(user.password, existing_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token = create_access_token(data={"sub": existing_user["email"]}, expires_delta=timedelta(minutes=30))
    return {"access_token": access_token, "token_type": "bearer"}
