from fastapi import APIRouter, HTTPException, Depends
from app.models.user import (
    UserDetailResponse,
    UserLikeRequest,
    UserLikeResponse,
    UserInterviewSummaryResponse,
    UserStatisticsResponse,
    UserTargetRequest,
    UserTargetResponse
)
from app.services.user_service import (
    get_user_detail,
    like_interview,
    get_user_interview_summary,
    get_user_statistics,
    set_user_target,
    get_user_target
)
from app.api.helper import get_token

router = APIRouter(prefix="/user")

@router.get(
    "/detail",
    summary="Get User Details",
    description="Retrieves complete user profile including full interviews detail and badges",
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
        raise HTTPException(status_code=500, detail=str(e)) from e

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
        raise HTTPException(status_code=500, detail=str(e)) from e

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
        raise HTTPException(status_code=500, detail=str(e)) from e

@router.get(
    "/statistics",
    summary="Get User Statistics",
    description="Retrieves comprehensive user statistics including all performance metrics, active days history, and achievement records",
    response_model=UserStatisticsResponse
)
async def user_statistics(token: str = Depends(get_token)):
    try:
        from app.services.auth_service import get_user_id_and_email
        id_email = get_user_id_and_email(token)
        user_id = id_email.get("id")

        user_stats = get_user_statistics(user_id)
        stats_dict = user_stats.get_dict()

        # Convert last_active_day date to string if it's a date object
        if hasattr(stats_dict.get("last_active_day"), 'isoformat'):
            stats_dict["last_active_day"] = stats_dict["last_active_day"].isoformat()

        return stats_dict
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e)) from e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


@router.post(
    "/target",
    summary="Set User Target Scores",
    description="Sets the user's target scores for each evaluation criterion (clarity, relevance, keyword, confidence, conciseness)",
    response_model=UserTargetResponse
)
async def set_target(payload: UserTargetRequest, token: str = Depends(get_token)):
    try:
        target = {
            "target_clarity": payload.target_clarity,
            "target_relevance": payload.target_relevance,
            "target_keyword": payload.target_keyword,
            "target_confidence": payload.target_confidence,
            "target_conciseness": payload.target_conciseness
        }
        result = set_user_target(token, target)
        if result is None:
            raise HTTPException(status_code=404, detail="User not found")
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


@router.get(
    "/target",
    summary="Get User Target Scores",
    description="Retrieves the user's target scores for each evaluation criterion",
    response_model=UserTargetResponse
)
async def get_target(token: str = Depends(get_token)):
    try:
        result = get_user_target(token)
        if result is None:
            raise HTTPException(status_code=404, detail="User not found")
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e
