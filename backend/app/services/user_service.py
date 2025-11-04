# app/services/user_service.py
from app.db.crud import get_user_basic, get_user_interviews, get_user_badges
from app.db.models import current_millis
from app.services import badge_service
from datetime import datetime, timezone
from app.services.utils import with_db_session

def day_from_millis(ms: int):
    """Convert millisecond timestamps to UTC days integers."""
    return datetime.fromtimestamp(ms / 1000, tz=timezone.utc).date().toordinal()

@with_db_session
def get_user_detail(user_id: str, db=None):
    """Integrates user basic information, interview records (including questions), and badge unlocking information."""
    user = get_user_basic(db, user_id)
    if not user:
        return None

    interviews = get_user_interviews(db, user_id)
    badges = get_user_badges(db, user_id)

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


@with_db_session
def update_user_badge(user_id: str, update_data: dict, db=None):
    user = get_user_basic(db, user_id)
    if not user:
        raise ValueError("User not found")

    # Update field
    for key, val in update_data.items():
        setattr(user, key, val)

    db.commit()
    db.refresh(user)

    # Check badge
    new_badges = badge_service.check_badges_for_user(db, user)

    return {
        "status": "updated",
        "user_id": user.user_id,
        "new_badges": [b.name for b in new_badges]
    }


def update_user_login(db, user_id: str):
    """Update login count and consecutive days when user logs in."""
    user = get_user_basic(db, user_id)
    if not user:
        raise ValueError("User not found")

    now_ms = current_millis()
    now_day = day_from_millis(now_ms)
    last_day = day_from_millis(user.last_login) if user.last_login else None

    # Login logic judgment
    if last_day is None or now_day != last_day:
        # Login to a new day
        user.total_logins = (user.total_logins or 0) + 1

        # Determine if logins are consecutive
        if last_day is not None and now_day - last_day == 1:
            user.consecutive_days = (user.consecutive_days or 0) + 1
        else:
            user.consecutive_days = 1

        user.last_login = now_ms
        db.commit()
        db.refresh(user)

        # Check badge
        new_badges = badge_service.check_badges_for_user(db, user)

        return {
            "status": "new_day_login",
            "new_badges": [b.name for b in new_badges],
            "total_logins": user.total_logins,
            "consecutive_days": user.consecutive_days
        }

    else:
        # Repeated logins on the same day will not be counted.
        return {
            "status": "same_day_login",
            "total_logins": user.total_logins,
            "consecutive_days": user.consecutive_days
        }