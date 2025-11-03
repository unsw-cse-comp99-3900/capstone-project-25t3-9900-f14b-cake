# app/api/interview.py
from fastapi import APIRouter, Request, HTTPException
from app.services.interview_service import interview_start, interview_feedback

router = APIRouter(prefix="/interview", tags=["Interview"])

@router.post("/start")
async def start_interview(request: Request):
    """
    Start interview session and generate questions.
    Expect JSON:
    {
        "token": "jwt",
        "job_description": "...",
        "question_type": "technical"
    }
    """
    try:
        data = await request.json()
        token = data.get("token")
        job_description = data.get("job_description")
        question_type = data.get("question_type")

        if not all([token, job_description, question_type]):
            raise HTTPException(status_code=400, detail="Missing required fields")

        result = interview_start(token, job_description, question_type)
        return {"status": "ok", "interview_questions": result["interview_questions"]}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/feedback")
async def feedback(request: Request):
    """
    Generate feedback and scores.
    Expect JSON:
    {
        "token": "jwt",
        "interview_question": "...",
        "interview_answer": "..."
    }
    """
    try:
        data = await request.json()
        token = data.get("token")
        question = data.get("interview_question")
        answer = data.get("interview_answer")

        if not all([token, question, answer]):
            raise HTTPException(status_code=400, detail="Missing required fields")

        result = interview_feedback(token, question, answer)
        return {
            "status": "ok",
            "interview_feedback": result["interview_feedback"]
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
