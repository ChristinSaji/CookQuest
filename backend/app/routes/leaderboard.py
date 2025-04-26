from fastapi import APIRouter, Depends, Query
from app.dependencies import get_current_user
from app.database import db
from datetime import datetime, timedelta, timezone

router = APIRouter()
history_collection = db["cooking_history"]

@router.get("/leaderboard")
def get_leaderboard(
    period: str = Query("week", enum=["week", "month"]),
    limit: int = 10,
    user=Depends(get_current_user)
):
    now = datetime.now(timezone.utc)

    if period == "week":
        start_date = now - timedelta(days=7)
    elif period == "month":
        start_date = now - timedelta(days=30)
    else:
        start_date = None

    match_stage = {"user_id": {"$exists": True}}

    if start_date:
        match_stage["completed_at"] = {"$gte": start_date}

    pipeline = [
        {"$match": match_stage},
        {
            "$group": {
                "_id": "$user_id",
                "total_score": {"$sum": "$total_score"},
                "count": {"$sum": 1}
            }
        },
        {"$sort": {"total_score": -1}},
        {"$limit": limit},
        {
            "$lookup": {
                "from": "users",
                "let": {"user_id_str": "$_id"},
                "pipeline": [
                    {
                        "$match": {
                            "$expr": {
                                "$eq": ["$_id", {"$toObjectId": "$$user_id_str"}]
                            }
                        }
                    }
                ],
                "as": "user_info"
            }
        },
        {"$unwind": "$user_info"},
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
