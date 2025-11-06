# app/db/crud.py
from sqlalchemy.orm import Session, joinedload
from app.db.db_config import with_db_session
from app.db.models import Question, Interview, User, Badge, UserBadge, current_millis


def add_question(question: Question, db: Session = None):
    db.add(question)
    db.commit()
    db.refresh(question)
    return question



def add_interview(interview: Interview, db: Session = None):
    db.add(interview)
    db.commit()
    db.refresh(interview)
    return interview


def get_interview(interview_id: str, db: Session = None):
    return db.query(Interview).filter(Interview.interview_id == interview_id).first()


def update_interview_like(interview_id: str, is_like: bool, db: Session = None):
    interview = get_interview(interview_id, db)
    if not interview:
        return None
    if is_like:
        interview.is_like = True
    else:
        interview.is_like = False
    db.commit()
    db.refresh(interview)
    return interview
    


def add_user(user: User, db: Session = None):
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def update_user(user_id: str, update_data: dict, db=None):
    """
    General user update functions. Excluding interviews and user_badges.
    update_data is a dictionary of fields to be updated, for example:
    {"last_login": date.today(), "total_login": 5}
    """
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        return None

    for key, value in update_data.items():
        if hasattr(user, key):
            setattr(user, key, value)

    db.commit()
    db.refresh(user)
    return user



def get_questions_by_user(user_id: str, db: Session = None):
    return db.query(Question).filter(Question.user_id == user_id).all()



def get_user_basic(user_id: str, db: Session = None):
    return db.query(User).filter(User.user_id == user_id).first()



def get_user_interviews(user_id: str, db: Session = None):
    return (
        db.query(Interview)
        .options(joinedload(Interview.questions))
        .filter(Interview.user_id == user_id)
        .all()
    )



def get_user_badges(user_id: str, db: Session = None):
    return (
        db.query(UserBadge)
        .filter(UserBadge.user_id == user_id)
        .all()
    )



def get_all_badges(db: Session = None):
    return db.query(Badge).all()



def get_unlocked_badges(user_id: str, db: Session = None):
    return (
        db.query(Badge)
        .join(UserBadge)
        .filter(UserBadge.user_id == user_id)
        .all()
    )



def unlock_badge(user_id: str, badge_id: int, db: Session = None):
    new_unlock = UserBadge(
        user_id=user_id,
        badge_id=badge_id,
        unlocked_timestamp=current_millis(),
    )
    db.add(new_unlock)
    db.commit()
    db.refresh(new_unlock)
    return new_unlock