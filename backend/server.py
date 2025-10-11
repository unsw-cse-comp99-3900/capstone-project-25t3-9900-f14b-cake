# server.py
from fastapi import FastAPI, HTTPException, Request, status, Header, Query
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import config

from auth import login, logout
from home import get_home_dashboard
from interview import interview_start, interview_text_answer, interview_feedback

# Models
class LoginRequest(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    token: str

class QuestionRequest(BaseModel):
    token: str
    job_description: str

class FeedbackRequest(BaseModel):
    token: str
    interview_question: str
    interview_answer: str


# App Setup
app = FastAPI(title="Interview API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Error Handling
@app.exception_handler(Exception)
async def default_exception_handler(request: Request, exc: Exception):
    if isinstance(exc, HTTPException):
        code = exc.status_code
        message = exc.detail
    else:
        code = status.HTTP_500_INTERNAL_SERVER_ERROR
        message = "Internal Server Error"

    payload = {
        "code": code,
        "name": "System Error",
        "message": message,
    }
    return JSONResponse(status_code=code, content=payload)

# Routes
@app.get("/home", summary="Get Home Dashboard")
async def server_home(token: str = Header(...)):
    ret = get_home_dashboard(token)
    return {
        "interview_ids": ret["interview_ids"]
    }

@app.post("/login", summary="User Login")
async def server_auth_login(payload: LoginRequest):
    ret = login(payload.email, payload.password)
    return {
        "user_id": ret["user_id"],
        "token": ret["token"]
    }

@app.post("/logout", summary="User Logout")
async def server_auth_logout(payload: Token):
    logout(payload.token)
    return {}

@app.post("/interview/start", summary="Start Interview")
async def server_interview_start(payload: QuestionRequest):
    ret = interview_start(payload.token, payload.job_description)
    return {
        "interview_questions": ret["interview_questions"]
    }

@app.post("/interview/answer", summary="Answer Interview Question")
async def server_interview_answer(payload: Token):
    ret = interview_text_answer(payload.token)
    return {
        "interview_answer": ret["interview_answer"]
    }

@app.post("/interview/feedback", summary="Generate Interview Feedback")
async def server_interview_feedback(payload: FeedbackRequest):
    ret = interview_feedback(payload.token, payload.interview_question, payload.interview_answer)
    return {
        "interview_feedback": ret["interview_feedback"],
        "interview_score": ret["interview_score"],
    }

# Local Dev
if __name__ == "__main__":
    uvicorn.run("server:app", host="0.0.0.0", port=config.port, reload=True)
