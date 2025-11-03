from fastapi import FastAPI, HTTPException, Request, status, Header, Depends
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field
from typing import List, Optional
import uvicorn

from app.core.config import url, port
from app.services.auth_service import login
from app.services.interview_service import interview_start, interview_feedback
from app.services.user_service import get_user_detail

# Security
security = HTTPBearer()

def get_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    return credentials.credentials

# Request Models
class LoginRequest(BaseModel):
    email: str = Field(description="User's email address", example="user@example.com")
    google_jwt: Optional[str] = Field(
        default=None,
        description="Google JWT token for authentication",
        example="eyJhbGciOiJSUzI1NiIsImtpZCI6IjE4MmU0M..."
    )
    apple_jwt: Optional[str] = Field(
        default=None,
        description="Apple JWT token for authentication",
        example="eyJraWQiOiJlWGF1bm1MIiwiYWxnIjoiUlMyNTYifQ..."
    )


class QuestionRequest(BaseModel):
    job_description: str = Field(
        description="Detailed job description for the interview",
        example="Senior Python Developer with 5+ years experience in FastAPI, PostgreSQL, and AWS"
    )
    question_type: str = Field(description="Type of interview question", example="technical")

class FeedbackRequest(BaseModel):
    interview_question: str = Field(
        description="The interview question that was asked",
        example="Explain the difference between async and sync functions in Python"
    )
    interview_answer: str = Field(
        description="The candidate's answer to the question",
        example="Async functions allow for non-blocking operations..."
    )

# Response Models

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
    interview_feedback: dict = Field(
        description="Detailed feedback breakdown with scores and comments for each criterion",
        example={
            "clarity_structure_score": 5,
            "clarity_structure_feedback": "The response is well-organized, with clear sections addressing each aspect of the question.",
            "relevance_score": 5,
            "relevance_feedback": "The answer directly addresses the differences between Python 2 and 3 and emphasizes the importance of using Python 3, which is highly relevant.",
            "keyword_alignment_score": 4,
            "keyword_alignment_feedback": "The candidate used relevant technical terms, but could further enhance alignment by mentioning specific libraries or frameworks commonly used in Python 3.",
            "confidence_score": 4,
            "confidence_feedback": "The tone is confident and knowledgeable, though a bit more enthusiasm could enhance the delivery.",
            "conciseness_score": 4,
            "conciseness_feedback": "The answer is mostly concise, but could be slightly tightened by reducing redundancy in explanations.",
            "overall_summary": "Overall, the candidate demonstrated a strong understanding of the differences between Python 2 and 3, effectively communicating their importance for new projects. To improve, the candidate could incorporate more specific examples of libraries and maintain a more dynamic tone throughout.",
            "overall_score": 4.4
        }
    )

class QuestionDetail(BaseModel):
    interview_question: str = Field(
        description="The interview question that was asked",
        example="Explain the difference between async and sync functions in Python"
    )
    interview_answer: str = Field(
        description="The candidate's answer to the question",
        example="Async functions allow for non-blocking operations..."
    )
    interview_feedback: dict = Field(
        description="Detailed feedback with scores for the answer",
        example={
            "clarity_structure_score": 5,
            "clarity_structure_feedback": "Well organized response...",
            "relevance_score": 4,
            "relevance_feedback": "Addresses the question directly...",
            "keyword_alignment_score": 4,
            "keyword_alignment_feedback": "Good use of technical terms...",
            "confidence_score": 5,
            "confidence_feedback": "Confident delivery...",
            "conciseness_score": 4,
            "conciseness_feedback": "Concise and to the point...",
            "overall_summary": "Strong answer overall...",
            "overall_score": 4.4
        }
    )

class BadgeDetail(BaseModel):
    badge_id: int = Field(
        description="Badge identifier",
        example=1
    )
    unlock_date: int = Field(
        description="Unix timestamp when the badge was unlocked",
        example=1698796800
    )

class UserDetailResponse(BaseModel):
    interviews: List[List[QuestionDetail]] = Field(
        description="List of interviews, where each interview contains a list of questions with answers and feedback",
        example=[
            [
                {
                    "interview_question": "What is your experience with Python?",
                    "interview_answer": "I have 5 years of experience...",
                    "interview_feedback": {
                        "clarity_structure_score": 5,
                        "clarity_structure_feedback": "Well organized...",
                        "relevance_score": 4,
                        "relevance_feedback": "Relevant to the question...",
                        "keyword_alignment_score": 4,
                        "keyword_alignment_feedback": "Good keywords...",
                        "confidence_score": 5,
                        "confidence_feedback": "Confident...",
                        "conciseness_score": 4,
                        "conciseness_feedback": "Concise...",
                        "overall_summary": "Strong answer...",
                        "overall_score": 4.4
                    }
                }
            ]
        ]
    )
    badges: List[BadgeDetail] = Field(
        description="List of badges earned by the user",
        example=[
            {
                "badge_id": 1,
                "unlock_date": 1698796800
            },
            {
                "badge_id": 2,
                "unlock_date": 1699401600
            },
            {
                "badge_id": 1,
                "unlock_date": 1700006400
            }
        ]
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
@app.post(
    "/login",
    summary="User Login",
    description="Authenticates a user with third-party login (Google or Apple). Requires email and either google_jwt or apple_jwt token.",
    response_model=LoginResponse,
    tags=["Authentication"]
)
async def server_auth_login(payload: LoginRequest):
    ret = login(payload.email, payload.google_jwt, payload.apple_jwt)
    return {
        "user_id": ret["user_id"],
        "token": ret["token"]
    }

@app.post(
    "/interview/start",
    summary="Start Interview",
    description="Initiates a new interview session based on the provided job description. Generates relevant interview questions.",
    response_model=InterviewStartResponse,
    tags=["Interview"]
)
async def server_interview_start(payload: QuestionRequest, token: str = Depends(get_token)):
    ret = interview_start(token, payload.job_description, payload.question_type)
    return {
        "interview_questions": ret["interview_questions"]
    }

@app.post(
    "/interview/feedback",
    summary="Generate Interview Feedback",
    description="Analyzes the candidate's answer to an interview question and provides detailed feedback along with scores for each criterion",
    response_model=InterviewFeedbackResponse,
    tags=["Interview"]
)
async def server_interview_feedback(payload: FeedbackRequest, token: str = Depends(get_token)):
    ret = interview_feedback(token, payload.interview_question, payload.interview_answer)
    return {
        "interview_feedback": ret["interview_feedback"]
    }

@app.get(
    "/user/detail",
    summary="Get User Details",
    description="Retrieves all interviews and questions for the authenticated user, including answers and feedback",
    response_model=UserDetailResponse,
    tags=["User"]
)
async def server_user_detail(token: str = Depends(get_token)):
    ret = get_user_detail(token)
    return {
        "interviews": ret["interviews"],
        "badges": ret["badges"]
    }

# Local Dev
if __name__ == "__main__":
    uvicorn.run("app.server:app", host="127.0.0.1", port=port, reload=True)