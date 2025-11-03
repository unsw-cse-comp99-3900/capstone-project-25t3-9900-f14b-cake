# app/api/auth.py
from fastapi import APIRouter, Request, HTTPException
from app.services.auth_service import login

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login")
async def login_user(request: Request):
    """
    Authenticate user via Google/Apple JWT and return token.
    Expected JSON:
    {
        "email": "user@example.com",
        "google_jwt": "...",   # optional
        "apple_jwt": "..."     # optional
    }
    """
    try:
        data = await request.json()
        email = data.get("email")
        google_jwt = data.get("google_jwt")
        apple_jwt = data.get("apple_jwt")

        if not email:
            raise HTTPException(status_code=400, detail="Email is required.")

        result = login(email, google_jwt, apple_jwt)
        return {
            "status": "ok",
            "user_id": result["user_id"],
            "token": result["token"],
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
