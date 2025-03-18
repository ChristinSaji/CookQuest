from fastapi import FastAPI
from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

client = MongoClient(MONGO_URI)
db = client["cookquest"]

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Welcome to CookQuest API!"}
