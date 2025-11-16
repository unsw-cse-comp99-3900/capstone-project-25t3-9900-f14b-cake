"""Badge checks for answering-related badges and time-of-day badges."""
from datetime import datetime
from app.db.crud import get_unlocked_badges, get_all_badges, unlock_badge, update_user
from app.db.models import User, Badge
from app.services.utils import with_db_session


def _current_hour() -> int:
    """Return current local hour. Isolated for test patching."""
    return int(datetime.now().hour)


def _norm(n: str) -> str:
    return (n or "").strip().lower()


def _getattr_int(user: User, field: str, default: int = 0) -> int:
    value = getattr(user, field, default)
    return int(value or 0)


def _getattr_float(user: User, field: str, default: float = 0.0) -> float:
    value = getattr(user, field, default)
    return float(value or 0.0)


def _total_questions(user: User) -> int:
    return _getattr_int(user, "total_questions", 0)


def _avg_score(user: User, total_field: str) -> float:
    tq = _total_questions(user)
    total_value = _getattr_float(user, total_field, 0.0)
    if tq <= 0:
        return 0.0
    return float(total_value) / float(tq)


# XP progression
def condition_first_steps(user: User) -> bool:
    return _getattr_int(user, "xp", 0) >= 1


def condition_xp_novice(user: User) -> bool:
    return _getattr_int(user, "xp", 0) >= 100


def condition_xp_expert(user: User) -> bool:
    return _getattr_int(user, "xp", 0) >= 500


def condition_xp_master(user: User) -> bool:
    return _getattr_int(user, "xp", 0) >= 1000


# Answering progress
def condition_ice_breaker(user: User) -> bool:
    return _total_questions(user) >= 1


def condition_answer_rookie(user: User) -> bool:
    return _total_questions(user) >= 10


def condition_answer_expert(user: User) -> bool:
    return _total_questions(user) >= 50


def condition_answer_master(user: User) -> bool:
    return _total_questions(user) >= 100


# Login streaks
def condition_persistent(user: User) -> bool:
    return _getattr_int(user, "consecutive_days", 0) >= 3


def condition_dedicated(user: User) -> bool:
    return _getattr_int(user, "consecutive_days", 0) >= 7


def condition_relentless(user: User) -> bool:
    return _getattr_int(user, "consecutive_days", 0) >= 30


# Dimension averages (>= 90)
def condition_clarity_champion(user: User) -> bool:
    return _avg_score(user, "total_clarity") >= 90


def condition_relevance_expert(user: User) -> bool:
    return _avg_score(user, "total_relevance") >= 90


def condition_keyword_wizard(user: User) -> bool:
    return _avg_score(user, "total_keyword") >= 90


def condition_confidence_king_queen(user: User) -> bool:
    return _avg_score(user, "total_confidence") >= 90


def condition_conciseness_master(user: User) -> bool:
    return _avg_score(user, "total_conciseness") >= 90


# First session
def condition_first_session(user: User) -> bool:
    return _getattr_int(user, "total_interviews", 0) == 1


# Time-of-day
def condition_night_owl(user: User) -> bool:
    return _current_hour() >= 22


def condition_early_bird(user: User) -> bool:
    return _current_hour() < 7


# Registry mapping normalized badge name -> predicate
_BADGE_CHECKS = {
    # XP progression
    "first steps": condition_first_steps,
    "xp novice": condition_xp_novice,
    "xp expert": condition_xp_expert,
    "xp master": condition_xp_master,
    # Answering related
    "ice breaker": condition_ice_breaker,
    "answer rookie": condition_answer_rookie,
    "answer expert": condition_answer_expert,
    "answer master": condition_answer_master,
    # Login streaks
    "persistent": condition_persistent,
    "dedicated": condition_dedicated,
    "relentless": condition_relentless,
    # Dimension averages
    "clarity champion": condition_clarity_champion,
    "relevance expert": condition_relevance_expert,
    "keyword wizard": condition_keyword_wizard,
    "confidence king/queen": condition_confidence_king_queen,
    "conciseness master": condition_conciseness_master,
    # Sessions / meta
    "first session": condition_first_session,
    # Time-of-day
    "night owl": condition_night_owl,
    "early bird": condition_early_bird,
}


# @with_db_session
def check_badges_for_user(user, db=None):
    """
    Call this function every time user data is updated. 
    Check all unlockable badges. 
    If the conditions are met and the badges are not yet unlocked, then unlock them.
    """
    unlocked_badges = get_unlocked_badges(user.user_id, db)
    unlocked_ids = {b.badge_id for b in unlocked_badges}

    # Only consider known badges from registry
    allowed = set(_BADGE_CHECKS)
    available_badges = [b for b in get_all_badges(db) if _norm(b.name) in allowed]

    newly_unlocked = []

    for badge in available_badges:
        if badge.badge_id in unlocked_ids:
            continue

        if meets_condition(user, badge):
            unlock = unlock_badge(user.user_id, badge.badge_id, db)
            print(f"User {user.user_id} unlock badge {badge.name} at {unlock.unlocked_timestamp}.")
            newly_unlocked.append(badge)

    # Optionally update user's total_badges count
    if newly_unlocked:
        try:
            update_user(user.user_id, {"total_badges": user.total_badges + len(newly_unlocked)}, db)
        except Exception:
            pass

    return newly_unlocked


def meets_condition(user: User, badge: Badge) -> bool:
    """Evaluate whether a user meets the unlock condition for a given badge."""
    name = _norm(badge.name)
    predicate = _BADGE_CHECKS.get(name)
    if not predicate:
        return False
    return bool(predicate(user))