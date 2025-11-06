from fastapi import APIRouter, HTTPException
from app.models.auth import LoginRequest, LoginResponse
from app.services.auth_service import login

router = APIRouter()

@router.post(
    "/login",
    summary="User Login",
    description="Authenticates a user with third-party login (Google or Apple). Requires email and either google_jwt or apple_jwt token.",
    response_model=LoginResponse
)
async def login_user(payload: LoginRequest):
    """
    Authenticate user via Google/Apple JWT and return token.
    """
    try:
        result = login(payload.email, payload.google_jwt, payload.apple_jwt)
        return {
            "user_id": result["user_id"],
            "token": result["token"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))