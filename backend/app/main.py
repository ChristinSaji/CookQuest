from fastapi import FastAPI
from app.routes import users

app = FastAPI()

app.include_router(users.router, prefix="/auth", tags=["Authentication"])

@app.get("/")
def home():
    return {"message": "Welcome to CookQuest Backend!"}
