# app/services/user_service.py
from app.db import crud

def get_user_detail(db, user_id: str):
    """Integrates user basic information, interview records (including questions), and badge unlocking information."""
    user = crud.get_user_basic(db, user_id)
    if not user:
        return None

    interviews = crud.get_user_interviews(db, user_id)
    badges = crud.get_user_badges(db, user_id)

    result = {
        "user_id": user.user_id,
        # "user_email": user.user_email,
        # "xp": user.xp,
        # "total_interviews": user.total_interviews,
        # "total_questions": user.total_questions,
        "interviews": [
            {
                "interview_id": i.interview_id,
                "questions": [
                    {
                        "question_id": q.question_id,
                        "question": q.question,
                        "answer": q.answer,
                        "feedback": q.feedback,
                        "timestamp": q.timestamp
                    } for q in i.questions
                ]
            } for i in interviews
        ],
        "badges": [
            {
                "badge_id": b.badge_id,
                "unlocked_at": b.unlocked_at.isoformat()
            } for b in badges
        ]
    }

    return result
