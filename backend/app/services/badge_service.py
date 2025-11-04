# app/services/badge_service.py
from dataclasses import dataclass
from typing import Callable, Dict, List

from app.db.crud import get_unlocked_badges, get_all_badges, unlock_badge
from app.db.models import User, Badge
from app.services.utils import with_db_session


@dataclass(frozen=True)
class BadgeDefinition:
    code: str
    name: str
    description: str
    condition: Callable[[User], bool]


DEFAULT_BADGES: List[BadgeDefinition] = [
    BadgeDefinition(
        code="first_interview",
        name="First Interview",
        description="Complete your first interview session.",
        condition=lambda user: (user.total_interviews or 0) >= 1,
    ),
    BadgeDefinition(
        code="question_collector",
        name="Question Collector",
        description="Answer 10 interview questions in total.",
        condition=lambda user: (user.total_questions or 0) >= 10,
    ),
    BadgeDefinition(
        code="consistent_learner",
        name="Consistent Learner",
        description="Practice for 7 consecutive days.",
        condition=lambda user: (user.consecutive_days or 0) >= 7,
    ),
    BadgeDefinition(
        code="confidence_star",
        name="Confidence Star",
        description="Achieve a confidence score of 4 or higher in any interview feedback.",
        condition=lambda user: (user.max_confidence or 0) >= 4,
    ),
    BadgeDefinition(
        code="loyal_member",
        name="Loyal Member",
        description="Log in on 10 different days.",
        condition=lambda user: (user.total_logins or 0) >= 10,
    ),
]


_BADGES_BY_CODE: Dict[str, BadgeDefinition] = {badge.code: badge for badge in DEFAULT_BADGES}


@with_db_session
def ensure_badges_seeded(db=None) -> List[Badge]:
    """Ensure that all default badge definitions exist in the database."""
    existing = {badge.code: badge for badge in get_all_badges(db)}
    created = []
    for definition in DEFAULT_BADGES:
        if definition.code in existing:
            continue
        badge = Badge(
            code=definition.code,
            name=definition.name,
            description=definition.description,
        )
        db.add(badge)
        created.append(badge)

    if created:
        db.commit()
        for badge in created:
            db.refresh(badge)

    return created


@with_db_session
def check_badges_for_user(user, db=None):
    """Check all unlockable badges for the user and unlock those whose conditions are met."""
    ensure_badges_seeded(db=db)

    unlocked_badges = get_unlocked_badges(db, user.user_id)
    unlocked_ids = {badge.badge_id for badge in unlocked_badges}

    available_badges = get_all_badges(db)

    newly_unlocked: List[Badge] = []

    for badge in available_badges:
        if badge.badge_id in unlocked_ids:
            continue
        if meets_condition(user, badge):
            unlock_badge(db, user.user_id, badge.badge_id)
            newly_unlocked.append(badge)

    return newly_unlocked


def meets_condition(user: User, badge: Badge) -> bool:
    definition = _BADGES_BY_CODE.get(badge.code)
    if not definition:
        # Unknown badge is managed elsewhere; skip unlocking.
        return False
    return bool(definition.condition(user))