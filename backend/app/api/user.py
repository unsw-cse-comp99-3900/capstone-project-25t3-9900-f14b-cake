from fastapi import APIRouter, HTTPException, Depends
from app.models.user import (
    UserDetailResponse,
    UserLikeRequest,
    UserLikeResponse,
    UserInterviewSummaryResponse
)
from app.services.user_service import get_user_detail, get_user_full_detail, like_interview, get_user_interview_summary
from app.api.helper import get_token

router = APIRouter(prefix="/user")

@router.get(
    "/detail",
    summary="Get User Details",
    description="Retrieves complete user profile including all interviews, questions, answers, feedback, and badges",
    response_model=UserDetailResponse
)
async def user_detail(token: str = Depends(get_token)):
    try:
        result = get_user_detail(token)
        return {
            "user_id": result["user_id"],
            "user_email": result["user_email"],
            "xp": result["xp"],
            "total_interviews": result["total_interviews"],
            "total_questions": result["total_questions"],
            "total_active_days": result["total_active_days"],
            "last_active_day": result["last_active_day"],
            "consecutive_active_days": result["consecutive_active_days"],
            "max_consecutive_active_days": result["max_consecutive_active_days"],
            "interviews": result["interviews"],
            "badges": result["badges"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post(
    "/like",
    summary="Toggle Interview Like Status",
    description="Adds or removes an interview from the user's question bank by toggling the is_like status",
    response_model=UserLikeResponse
)
async def user_like(payload: UserLikeRequest, token: str = Depends(get_token)):
    try:
        result = like_interview(token, payload.interview_id)
        return {
            "is_like": result["is_like"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get(
    "/interview_summary",
    summary="Get Interview Performance Summary",
    description="Retrieves the user's average scores across all interview questions for each evaluation criterion",
    response_model=UserInterviewSummaryResponse
)
async def interview_summary(token: str = Depends(get_token)):
    try:
        result = get_user_interview_summary(token)
        if result is None:
            raise HTTPException(status_code=404, detail="User not found or no interview data available")
        return {
            "avg_clarity": result["avg_clarity"],
            "avg_relevance": result["avg_relevance"],
            "avg_keyword": result["avg_keyword"],
            "avg_confidence": result["avg_confidence"],
            "avg_conciseness": result["avg_conciseness"],
            "avg_overall": result["avg_overall"]
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))