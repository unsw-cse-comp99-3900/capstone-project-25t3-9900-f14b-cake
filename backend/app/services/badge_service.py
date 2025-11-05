# app/services/badge_service.py
from datetime import datetime
from app.db.crud import get_unlocked_badges, get_all_badges, unlock_badge
from app.db.models import User, Badge, current_millis
from app.services.utils import with_db_session


@with_db_session
def check_badges_for_user(user, db=None):
    """
    Call this function every time user data is updated. 
    Check all unlockable badges. 
    If the conditions are met and the badges are not yet unlocked, then unlock them.
    """
    unlocked_badges = get_unlocked_badges(db, user.user_id)
    unlocked_ids = {b.badge_id for b in unlocked_badges}

    available_badges = get_all_badges(db)

    newly_unlocked = []

    for badge in available_badges:
        if badge.badge_id in unlocked_ids:
            continue

        if meets_condition(user, badge):
            unlock_badge(db, user.user_id, badge.badge_id)
            newly_unlocked.append(badge)

    return newly_unlocked


def meets_condition(user: User, badge: Badge) -> bool:
    name = badge.name.lower()

    if name == "first interview":
        return user.total_interviews >= 1

    elif name == "high achiever":
        return user.total_score >= 90

    elif name == "consistent learner":
        return user.consecutive_days >= 7

    elif name == "comeback hero":
        diff_ms = current_millis() - user.last_login
        return diff_ms <= 24 * 60 * 60 * 1000  # 1 day

    return False