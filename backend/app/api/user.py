from fastapi import APIRouter, HTTPException, Depends
from app.models.user import UserDetailResponse
from app.services.user_service import get_user_detail, get_user_full_detail
from app.api.helper import get_token

router = APIRouter(prefix="/user")

@router.get(
    "/detail",
    summary="Get User Details",
    description="Retrieves all interviews and questions for the authenticated user, including answers and feedback",
    response_model=UserDetailResponse
)
async def user_detail(token: str = Depends(get_token)):
    try:
        result = get_user_detail(token)
        return {
            "user_id": result["user_id"],
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