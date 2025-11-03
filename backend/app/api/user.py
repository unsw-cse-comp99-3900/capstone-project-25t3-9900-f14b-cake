# app/api/user.py
from fastapi import APIRouter, Depends, Request, HTTPException
from sqlalchemy.orm import Session
from app.db.db_config import SessionLocal
from app.services import user_service
from app.services.auth_service import get_user_id
from app.services.user_service import get_user_detail

router = APIRouter(prefix="/user", tags=["user"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/detail")
async def server_user_detail(request: Request, db=Depends(get_db)):
    try:
        data = await request.json()
        token = data.get("token")

        if not token:
            raise HTTPException(status_code=400, detail="Missing required fields")
        else:
            user_id = get_user_id(token)

        detail = get_user_detail(db, user_id)
        return {"status": "ok", "detail": detail}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
