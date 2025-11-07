# app/services/user_service.py
from app.db.crud import add_user, update_user, get_user_basic, get_user_interviews, get_user_badges, get_all_badges
from app.db.models import current_millis, User
from app.services import badge_service
from datetime import datetime, timezone, date
from app.services.utils import with_db_session
from datetime import date

def day_from_millis(ms: int):
    """Convert millisecond timestamps to UTC days integers."""
    return datetime.fromtimestamp(ms / 1000, tz=timezone.utc).date().toordinal()

@with_db_session
def get_user_detail(token: str, db = None):
    """Integrates user basic information, interview records (including questions), and badge unlocking information."""
    from app.services.auth_service import get_user_id_and_email
    id_email = get_user_id_and_email(token)
    user_id = id_email.get("id")
    user = get_user_basic(user_id, db)
    if not user:
        return None

    interviews = get_user_interviews(user_id, db)
    badges = get_user_badges(user_id, db)

    # result = {
    #     "user_id": user.user_id,
    #     "interviews": [
    #         [
    #             {
    #                 "interview_type": q.question_type,
    #                 "interview_question": q.question,
    #                 "interview_answer": q.answer,
    #                 "interview_feedback": dict(q.feedback) if q.feedback else {}
    #             } for q in i.questions
    #         ] for i in interviews if i.questions
    #     ],
    #     "badges": [
    #         {
    #             "badge_id": b.badge_id,
    #             "unlocked_at": b.unlocked_at.isoformat()
    #         } for b in badges
    #     ]
    # }

    result = {
        "user_id": user.user_id,
        "user_email": user.user_email,
        "xp": user.xp,
        "total_interviews": user.total_interviews,
        "total_questions": user.total_questions,
        "interviews": [
            {
                "interview_id": i.interview_id,
                "interview_timestamp": i.timestamp,
                "is_like": i.is_like,
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
                "unlocked_data": b.unlocked_timestamp
            } for b in badges
        ]
    }

    return result


def create_new_user(user_id: str, user_email: str, db = None):
    print("Create new user:", user_id)
    user = User(
        user_id=user_id,
        user_email=user_email,
        xp=0,
        total_questions=0,
        total_interviews=0,
        total_badges=0,
        total_logins=0,
        last_login=date.today(),
        consecutive_days=0,
        max_clarity=0,
        max_relevance=0,
        max_keyword=0,
        max_confidence=0,
        max_conciseness=0,
        total_clarity=0,
        total_relevance=0,
        total_keyword=0,
        total_confidence=0,
        total_conciseness=0,
        total_overall=0.0
    )
    user = add_user(user, db)
    return user


def update_user_login(user_id: str, db = None):
    print("User login:", user_id)
    user = get_user_basic(user_id, db)
    if not user:
        return None
    
    new_login = date.today()
    if (new_login - user.last_login).days == 1 or user.total_logins == 0:
        update_data = {"last_login": new_login, 
                        "consecutive_days": user.consecutive_days + 1,
                        "total_logins": user.total_logins + 1
                        }
    elif (new_login - user.last_login).days > 1:
        update_data = {"last_login": new_login, 
                        "consecutive_days": 1,
                        "total_logins": user.total_logins + 1
                        }
    else:
        update_data = None

    if update_data:
        user = update_user(user_id, update_data, db)
    
    return user



@with_db_session
def get_user_full_detail(token: str, db = None):
    """Integrates user basic information, interview records (including questions), and badge unlocking information."""
    from app.services.auth_service import get_user_id_and_email
    id_email = get_user_id_and_email(token)
    user_id = id_email.get("id")
    user = get_user_basic(user_id, db)
    if not user:
        return None

    interviews = get_user_interviews(user_id, db)
    badges = get_user_badges(user_id, db)
    # Build badge metadata map for name/description lookup
    _all_badges = get_all_badges(db)
    badge_meta_by_id = {b.badge_id: {"name": b.name, "description": b.description} for b in _all_badges}

    full_result = {
        "user_id": user.user_id,
        "user_email": user.user_email,
        "xp": user.xp,
        "total_interviews": user.total_interviews,
        "total_questions": user.total_questions,
        "interviews": [
            {
                "interview_id": i.interview_id,
                "interview_timestamp": i.timestamp,
                "is_like": i.is_like,
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
                "unlocked_data": b.unlocked_timestamp
            } for b in badges
        ]
    }

    return full_result    

@with_db_session
def get_user_interview_summary(token: str, db = None):
    from app.services.auth_service import get_user_id_and_email
    id_email = get_user_id_and_email(token)
    user_id = id_email.get("id")
    user = get_user_basic(user_id, db)
    if not user:
        return None
    
    questions_number = float(user.total_questions)
    result = {
        "avg_clarity": user.total_clarity / questions_number,
        "avg_relevance": user.total_relevance / questions_number,
        "avg_keyword": user.total_keyword / questions_number,
        "avg_confidence": user.total_confidence / questions_number,
        "avg_conciseness": user.total_conciseness / questions_number,
        "avg_overall": user.total_overall / questions_number
    }
    return result

def like_interview(token: str, interview_id = str):
    return