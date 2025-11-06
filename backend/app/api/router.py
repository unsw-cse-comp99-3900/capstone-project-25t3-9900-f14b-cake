from fastapi import FastAPI
from app.api import auth, interview, user

def register_routers(app: FastAPI):
    """Unified registration of all routes"""
    app.include_router(auth.router, tags=["Authentication"])
    app.include_router(interview.router, tags=["Interview"])
    app.include_router(user.router, tags=["User"])