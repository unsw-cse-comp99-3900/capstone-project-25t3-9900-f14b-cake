from fastapi import APIRouter, HTTPException, Depends
from app.models.user import UserDetailResponse
from app.services.user_service import get_user_detail
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