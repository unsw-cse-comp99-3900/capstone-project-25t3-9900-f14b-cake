from fastapi import APIRouter, HTTPException, Depends
from app.models.user import (
    UserDetailResponse,
    UserLikeRequest,
    UserLikeResponse
)
from app.services.user_service import get_user_detail, get_user_full_detail, like_interview
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
            "interviews": result["interviews"],
            "badges": result["badges"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



@router.get(
    "/badges",
    summary="Get User Badges",
    description="Return unlocked badges with name, description and timestamp."
)
async def user_badges(token: str = Depends(get_token)):
    try:
        detail = get_user_full_detail(token)
        return {"user_id": detail["user_id"], "badges": detail["badges"]}
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