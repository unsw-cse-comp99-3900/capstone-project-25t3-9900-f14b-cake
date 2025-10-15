# server.py
from fastapi import FastAPI, HTTPException, Request, status, Header, Query
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List
import uvicorn
import config

from auth import login, logout
from home import get_home_dashboard
from interview import interview_start, interview_feedback

# Request Models
class LoginRequest(BaseModel):
    email: str = Field(description="User's email address", example="user@example.com")
    password: str = Field(description="User's password", example="mypassword123")

class LogoutRequest(BaseModel):
    token: str = Field(description="Authentication token", example="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")

class QuestionRequest(BaseModel):
    token: str = Field(description="Authentication token", example="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    job_description: str = Field(
        description="Detailed job description for the interview",
        example="Senior Python Developer with 5+ years experience in FastAPI, PostgreSQL, and AWS"
    )
    question_type: str = Field(description="Type of interview question", example="technical")

class FeedbackRequest(BaseModel):
    token: str = Field(description="Authentication token", example="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    interview_question: str = Field(
        description="The interview question that was asked",
        example="Explain the difference between async and sync functions in Python"
    )
    interview_answer: str = Field(
        description="The candidate's answer to the question",
        example="Async functions allow for non-blocking operations..."
    )

# Response Models
class HomeResponse(BaseModel):
    interview_ids: List[str] = Field(
        description="List of interview session IDs",
        example=["int_123", "int_456", "int_789"]
    )

class LoginResponse(BaseModel):
    user_id: str = Field(description="Unique user identifier", example="user_123")
    token: str = Field(description="JWT authentication token", example="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")

class InterviewStartResponse(BaseModel):
    interview_questions: List[str] = Field(
        description="List of generated interview questions",
        example=[
            "Tell me about your experience with Python and FastAPI",
            "How do you handle error handling in REST APIs?",
            "What's your approach to database optimization?"
        ]
    )

class InterviewFeedbackResponse(BaseModel):
    interview_feedback: str = Field(
        description="Detailed feedback on the candidate's answer",
        example="Your answer demonstrated a solid understanding of asynchronous programming concepts. You correctly explained the non-blocking nature of async functions and provided relevant examples."
    )
    interview_score: List[int] = Field(
        description="List of interview score, out of 5",
        example=[4, 3, 5],
    )


# App Setup
app = FastAPI(
    title="Interview API",
    version="1.0.0",
)

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
@app.get(
    "/home",
    summary="Get Home Dashboard",
    description="Retrieves the user's home dashboard containing all their interview IDs",
    response_model=HomeResponse,
    tags=["Dashboard"]
)
async def server_home(token: str = Header(description="Authentication token for the user")):
    ret = get_home_dashboard(token)
    return {
        "interview_ids": ret["interview_ids"]
    }

@app.post(
    "/login",
    summary="User Login",
    description="Authenticates a user with email and password, returns a token for subsequent requests",
    response_model=LoginResponse,
    tags=["Authentication"]
)
async def server_auth_login(payload: LoginRequest):
    ret = login(payload.email, payload.password)
    return {
        "user_id": ret["user_id"],
        "token": ret["token"]
    }

@app.post(
    "/logout",
    summary="User Logout",
    description="Invalidates the user's authentication token",
    tags=["Authentication"]
)
async def server_auth_logout(payload: LogoutRequest):
    logout(payload.token)
    return {}

@app.post(
    "/interview/start",
    summary="Start Interview",
    description="Initiates a new interview session based on the provided job description. Generates relevant interview questions.",
    response_model=InterviewStartResponse,
    tags=["Interview"]
)
async def server_interview_start(payload: QuestionRequest):
    ret = interview_start(payload.token, payload.job_description, payload.question_type)
    return {
        "interview_questions": ret["interview_questions"]
    }

@app.post(
    "/interview/feedback",
    summary="Generate Interview Feedback",
    description="Analyzes the candidate's answer to an interview question and provides detailed feedback along with a score",
    response_model=InterviewFeedbackResponse,
    tags=["Interview"]
)
async def server_interview_feedback(payload: FeedbackRequest):
    ret = interview_feedback(payload.token, payload.interview_question, payload.interview_answer)
    return {
        "interview_feedback": ret["interview_feedback"],
        "interview_score": ret["interview_score"],
    }

# Local Dev
if __name__ == "__main__":
    uvicorn.run("server:app", host="127.0.0.1", port=config.port, reload=True)