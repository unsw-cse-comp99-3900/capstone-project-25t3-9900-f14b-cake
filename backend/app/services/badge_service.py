"""Badge checks for answering-related badges and time-of-day badges."""
from datetime import datetime
from app.db.crud import get_unlocked_badges, get_all_badges, unlock_badge
from app.db.models import User, Badge
from app.services.utils import with_db_session


def _current_hour() -> int:
    """Return current local hour. Isolated for test patching."""
    return int(datetime.now().hour)

@with_db_session
def check_badges_for_user(user, db=None):
    """
    Call this function every time user data is updated. 
    Check all unlockable badges. 
    If the conditions are met and the badges are not yet unlocked, then unlock them.
    """
    unlocked_badges = get_unlocked_badges(user.user_id, db)
    unlocked_ids = {b.badge_id for b in unlocked_badges}

    # Only consider answering-related badges
    allowed = {"ice breaker", "answer rookie", "answer expert", "answer master", "night owl", "early bird"}
    available_badges = [b for b in get_all_badges(db) if b.name.lower() in allowed]

    newly_unlocked = []

    for badge in available_badges:
        if badge.badge_id in unlocked_ids:
            continue

        if meets_condition(user, badge):
            unlock_badge(user.user_id, badge.badge_id, db)
            print("unluck:" + badge.name)
            newly_unlocked.append(badge)

    return newly_unlocked


def meets_condition(user: User, badge: Badge) -> bool:
    """Conditions for answering badges based on total_questions count."""
    name = badge.name.lower()
    total_questions = getattr(user, "total_questions", 0)
    if name == "ice breaker":
        return total_questions >= 1
    if name == "answer rookie":
        return total_questions >= 10
    if name == "answer expert":
        return total_questions >= 50
    if name == "answer master":
        return total_questions >= 100
    if name == "night owl":
        # Assume check is triggered right after answering; use local server time
        return _current_hour() >= 22
    if name == "early bird":
        return _current_hour() < 7
    return False