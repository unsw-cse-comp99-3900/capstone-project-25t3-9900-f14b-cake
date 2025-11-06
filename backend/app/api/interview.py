from fastapi import APIRouter, HTTPException, Depends
from app.models.interview import (
    InterviewStartRequest,
    InterviewFeedbackRequest,
    InterviewStartResponse,
    InterviewFeedbackResponse
)
from app.services.interview_service import interview_start, interview_feedback
from app.api.helper import get_token

router = APIRouter(prefix="/interview")

@router.post(
    "/start",
    summary="Start Interview",
    description="Initiates a new interview session based on the provided job description. Generates relevant interview questions.",
    response_model=InterviewStartResponse
)
async def start_interview(payload: InterviewStartRequest, token: str = Depends(get_token)):
    try:
        result = interview_start(token, payload.job_description, payload.question_type)
        return {
            "interview_id": result["interview_id"],
            "interview_questions": result["interview_questions"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post(
    "/feedback",
    summary="Generate Interview Feedback",
    description="Analyzes the candidate's answer to an interview question and provides detailed feedback along with scores for each criterion",
    response_model=InterviewFeedbackResponse
)
async def feedback(payload: InterviewFeedbackRequest, token: str = Depends(get_token)):
    try:
        result = interview_feedback(
            token,
            payload.interview_id,
            payload.interview_type,
            payload.interview_question,
            payload.interview_answer
        )
        return {
            "interview_feedback": result["interview_feedback"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))