from fastapi import APIRouter, Depends
from app.dependencies import get_current_user
from app.database import db

router = APIRouter()
history_collection = db["cooking_history"]

@router.get("/leaderboard")
def get_leaderboard(limit: int = 10, user=Depends(get_current_user)):
    pipeline = [
        {
            "$group": {
                "_id": "$user_id",
                "total_score": {"$sum": "$total_score"},
                "count": {"$sum": 1}
            }
        },
        {
            "$sort": {"total_score": -1}
        },
        {
            "$limit": limit
        },
        {
            "$lookup": {
                "from": "users",
                "let": {"user_id_str": "$_id"},
                "pipeline": [
                    {
                        "$match": {
                            "$expr": {
                                "$eq": ["$_id", { "$toObjectId": "$$user_id_str" }]
                            }
                        }
                    }
                ],
                "as": "user_info"
            }
        },
        {
            "$unwind": "$user_info"
        },
        {
            "$project": {
                "user_id": "$_id",
                "name": "$user_info.name",
                "email": "$user_info.email",
                "total_score": 1,
                "completed_meals": "$count"
            }
        }
    ]

    leaderboard = list(history_collection.aggregate(pipeline))
    return leaderboard
