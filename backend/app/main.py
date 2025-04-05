from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.routes import users, recipes

app = FastAPI()

app.mount("/static", StaticFiles(directory="app/static"), name="static")

app.include_router(users.router, prefix="/auth", tags=["Authentication"])
app.include_router(recipes.router, tags=["Recipes"])

@app.get("/")
def home():
    return {"message": "Welcome to CookQuest Backend!"}
