from fastapi import FastAPI, APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime, timedelta
import os
import logging
import uuid
import hashlib
import hmac

# Load environment variables
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(ROOT_DIR, '.env'))

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'daily_bite_db')]

# Create the main app
app = FastAPI(
    title="Daily Bite: Fun & Facts API",
    description="Backend API for Daily Bite mobile app",
    version="1.0.0"
)

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Security
security = HTTPBearer(auto_error=False)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Models
class User(BaseModel):
    uid: str
    email: Optional[str] = None
    display_name: Optional[str] = None
    is_anonymous: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_active: datetime = Field(default_factory=datetime.utcnow)
    streak: int = 0
    total_points: int = 0
    last_streak_date: Optional[str] = None

class ScoreSubmission(BaseModel):
    userId: str
    score: int
    timeTaken: int
    date: str
    puzzle_category: Optional[str] = None
    puzzle_difficulty: Optional[str] = None

class RewardRequest(BaseModel):
    userId: str
    rewardType: str
    rewardAmount: float
    timestamp: str
    adUnitId: Optional[str] = None

class LeaderboardEntry(BaseModel):
    user_id: str
    user_name: str
    score: int
    rank: int
    date: str

# Utility Functions
def get_today_string():
    return datetime.utcnow().strftime('%Y-%m-%d')

def generate_transaction_hash(user_id: str, amount: float, timestamp: str) -> str:
    secret = os.environ.get('APP_SECRET', 'default-secret')
    data = f"{user_id}:{amount}:{timestamp}:{secret}"
    return hashlib.sha256(data.encode()).hexdigest()

# Authentication dependency (simplified for demo)
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if not credentials:
        return None
    # In a real app, you would verify the Firebase JWT token here
    return {"uid": "demo_user", "email": "demo@example.com"}

# API Routes
@api_router.get("/")
async def root():
    return {"message": "Daily Bite API is running!"}

@api_router.post("/users", response_model=dict)
async def create_or_update_user(user_data: User):
    """Create or update a user in the database"""
    try:
        existing_user = await db.users.find_one({"uid": user_data.uid})

        # Fields we’re willing to update if provided
        update_fields = {"last_active": datetime.utcnow()}
        if user_data.display_name:
            update_fields["display_name"] = user_data.display_name
        if user_data.email is not None:
            update_fields["email"] = user_data.email
        if user_data.is_anonymous is not None:
            update_fields["is_anonymous"] = user_data.is_anonymous

        if existing_user:
            await db.users.update_one(
                {"uid": user_data.uid},
                {"$set": update_fields}
            )
            # Re-read user (and stringify _id)
            updated = await db.users.find_one({"uid": user_data.uid})
            updated["_id"] = str(updated["_id"])
            return {"success": True, "message": "User updated", "user": updated}
        else:
            user_dict = user_data.dict()
            # ensure created_at/last_active present
            user_dict.setdefault("created_at", datetime.utcnow())
            user_dict.setdefault("last_active", datetime.utcnow())
            result = await db.users.insert_one(user_dict)
            return {"success": True, "message": "User created", "user_id": str(result.inserted_id)}

    except Exception as e:
        logging.error(f"Error creating/updating user: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.get("/users/{user_id}")
async def get_user(user_id: str):
    """Get user profile and stats"""
    try:
        user = await db.users.find_one({"uid": user_id})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Remove MongoDB ObjectId for JSON serialization
        user['_id'] = str(user['_id'])
        
        # Get additional stats
        today = get_today_string()
        today_score = await db.scores.find_one({"user_id": user_id, "date": today})
        
        user_stats = {
            "user": user,
            "today_score": today_score.get("score", 0) if today_score else 0,
            "puzzles_solved": await db.scores.count_documents({"user_id": user_id}),
            "best_score": 0  # Calculate from scores collection
        }
        
        return user_stats
    
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error getting user: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.post("/submit-score")
async def submit_score(score_data: ScoreSubmission):
    """Submit a puzzle score"""
    try:
        # Check if user already has a score for today
        existing_score = await db.scores.find_one({
            "user_id": score_data.userId,
            "date": score_data.date
        })
        
        if existing_score:
            # Update if new score is higher
            if score_data.score > existing_score["score"]:
                await db.scores.update_one(
                    {"user_id": score_data.userId, "date": score_data.date},
                    {"$set": {
                        "score": score_data.score,
                        "time_taken": score_data.timeTaken,
                        "updated_at": datetime.utcnow()
                    }}
                )
                
                # Update user's total points
                await db.users.update_one(
                    {"uid": score_data.userId},
                    {"$inc": {"total_points": score_data.score - existing_score["score"]}}
                )
                
                return {"success": True, "message": "Score updated!", "new_record": True}
            else:
                return {"success": True, "message": "Score recorded (not a new record)", "new_record": False}
        else:
            # Create new score entry
            score_entry = {
                "user_id": score_data.userId,
                "score": score_data.score,
                "time_taken": score_data.timeTaken,
                "date": score_data.date,
                "category": score_data.puzzle_category,
                "difficulty": score_data.puzzle_difficulty,
                "created_at": datetime.utcnow()
            }
            
            await db.scores.insert_one(score_entry)
            
            # Update user's total points
            await db.users.update_one(
                {"uid": score_data.userId},
                {"$inc": {"total_points": score_data.score}}
            )
            
            return {"success": True, "message": "Score submitted!", "new_record": True}
    
    except Exception as e:
        logging.error(f"Error submitting score: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.get("/leaderboard")
async def get_leaderboard(period: str = "today", limit: int = 50):
    """Get leaderboard data"""
    try:
        if period == "today":
            today = get_today_string()
            pipeline = [
                {"$match": {"date": today}},
                {"$sort": {"score": -1, "time_taken": 1}},
                {"$limit": limit}
            ]
        else:  # all time
            pipeline = [
                {"$group": {
                    "_id": "$user_id",
                    "total_score": {"$sum": "$score"},
                    "best_score": {"$max": "$score"},
                    "games_played": {"$sum": 1}
                }},
                {"$sort": {"total_score": -1}},
                {"$limit": limit}
            ]
        
        scores = await db.scores.aggregate(pipeline).to_list(length=limit)
        
        # Add user names and ranks
        leaderboard = []
        for i, score in enumerate(scores):
            if period == "today":
                user = await db.users.find_one({"uid": score["user_id"]})
                entry = {
                    "user_id": score["user_id"],
                    "user_name": user.get("display_name", "Anonymous") if user else "Anonymous",
                    "score": score["score"],
                    "time_taken": score["time_taken"],
                    "rank": i + 1,
                    "date": score["date"]
                }
            else:
                user = await db.users.find_one({"uid": score["_id"]})
                entry = {
                    "user_id": score["_id"],
                    "user_name": user.get("display_name", "Anonymous") if user else "Anonymous",
                    "total_score": score["total_score"],
                    "best_score": score["best_score"],
                    "games_played": score["games_played"],
                    "rank": i + 1
                }
            
            leaderboard.append(entry)
        
        return leaderboard
    
    except Exception as e:
        logging.error(f"Error getting leaderboard: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.post("/process-reward")
async def process_reward(reward_data: RewardRequest):
    """Process ad reward for user"""
    try:
        # Generate transaction hash for deduplication
        transaction_hash = generate_transaction_hash(
            reward_data.userId,
            reward_data.rewardAmount,
            reward_data.timestamp
        )
        
        # Check for duplicate transaction
        existing_reward = await db.rewards.find_one({"transaction_hash": transaction_hash})
        if existing_reward:
            return {"success": False, "message": "Reward already processed"}
        
        # Validate reward amount (business logic)
        if reward_data.rewardAmount <= 0 or reward_data.rewardAmount > 100:
            raise HTTPException(status_code=400, detail="Invalid reward amount")
        
        # Create reward transaction
        reward_entry = {
            "user_id": reward_data.userId,
            "reward_type": reward_data.rewardType,
            "reward_amount": reward_data.rewardAmount,
            "ad_unit_id": reward_data.adUnitId,
            "transaction_hash": transaction_hash,
            "processed_at": datetime.utcnow(),
            "is_verified": True
        }
        
        await db.rewards.insert_one(reward_entry)
        
        # Update user's total points (rewards as points)
        await db.users.update_one(
            {"uid": reward_data.userId},
            {"$inc": {"total_points": int(reward_data.rewardAmount)}}
        )
        
        # Get updated user data
        user = await db.users.find_one({"uid": reward_data.userId})
        
        return {
            "success": True,
            "message": "Reward processed successfully",
            "reward_amount": reward_data.rewardAmount,
            "new_total_points": user.get("total_points", 0) if user else 0
        }
    
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error processing reward: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.post("/update-streak")
async def update_streak(user_id: str):
    """Update user's daily streak"""
    try:
        user = await db.users.find_one({"uid": user_id})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        today = get_today_string()
        last_streak_date = user.get("last_streak_date")
        current_streak = user.get("streak", 0)
        
        if last_streak_date:
            last_date = datetime.strptime(last_streak_date, '%Y-%m-%d')
            today_date = datetime.strptime(today, '%Y-%m-%d')
            diff_days = (today_date - last_date).days
            
            if diff_days == 1:
                # Consecutive day - increment streak
                new_streak = current_streak + 1
            elif diff_days > 1:
                # Streak broken - reset to 1
                new_streak = 1
            else:
                # Same day - no change
                new_streak = current_streak
        else:
            # First time - start streak
            new_streak = 1
        
        # Update user streak
        await db.users.update_one(
            {"uid": user_id},
            {"$set": {
                "streak": new_streak,
                "last_streak_date": today,
                "last_active": datetime.utcnow()
            }}
        )
        
        return {
            "success": True,
            "streak": new_streak,
            "message": f"Streak updated to {new_streak} days!"
        }
    
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error updating streak: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.get("/user/{user_id}/stats")
async def get_user_stats(user_id: str):
    """Get comprehensive user statistics"""
    try:
        user = await db.users.find_one({"uid": user_id})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Calculate stats
        total_games = await db.scores.count_documents({"user_id": user_id})
        
        # Get best score
        best_score_doc = await db.scores.find_one(
            {"user_id": user_id},
            sort=[("score", -1)]
        )
        best_score = best_score_doc["score"] if best_score_doc else 0
        
        # Calculate success rate (scores > 0)
        successful_games = await db.scores.count_documents({
            "user_id": user_id,
            "score": {"$gt": 0}
        })
        success_rate = (successful_games / total_games * 100) if total_games > 0 else 0
        
        # Get recent scores
        recent_scores = await db.scores.find(
            {"user_id": user_id},
            sort=[("created_at", -1)],
            limit=10
        ).to_list(length=10)
        
        return {
            "user_id": user_id,
            "display_name": user.get("display_name", "Anonymous"),
            "streak": user.get("streak", 0),
            "total_points": user.get("total_points", 0),
            "total_games": total_games,
            "best_score": best_score,
            "success_rate": round(success_rate, 1),
            "recent_scores": [
                {
                    "score": score["score"],
                    "date": score["date"],
                    "time_taken": score["time_taken"]
                }
                for score in recent_scores
            ]
        }
    
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error getting user stats: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "1.0.0"
    }

# Include the API router
app.include_router(api_router)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    logger.info("Daily Bite API starting up...")
    
    # Create indexes for better performance
    try:
        await db.users.create_index("uid", unique=True)
        await db.scores.create_index([("user_id", 1), ("date", 1)], unique=True)
        await db.scores.create_index([("date", 1), ("score", -1)])
        await db.rewards.create_index("transaction_hash", unique=True)
        logger.info("Database indexes created successfully")
    except Exception as e:
        logger.error(f"Error creating indexes: {str(e)}")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Daily Bite API shutting down...")
    client.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
