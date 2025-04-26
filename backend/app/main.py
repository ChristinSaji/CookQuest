from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.routes import users, recipes, steps, reviews, completion, history, leaderboard

app = FastAPI(root_path="/cookquest/api")

app.mount("/static", StaticFiles(directory="app/static"), name="static")

app.include_router(users.router, prefix="/auth", tags=["Authentication"])
app.include_router(recipes.router, tags=["Recipes"])
app.include_router(steps.router)
app.include_router(reviews.router, tags=["Reviews"])
app.include_router(completion.router)
app.include_router(history.router)
app.include_router(leaderboard.router, tags=["Leaderboard"])

@app.get("/")
def home():
    return {"message": "Welcome to CookQuest Backend!"}
