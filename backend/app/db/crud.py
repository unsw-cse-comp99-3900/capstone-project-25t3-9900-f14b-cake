# app/db/crud.py
from sqlalchemy.orm import Session, joinedload
from .models import Question, Interview, User, Badge, UserBadge, current_millis

def create_question(db: Session, question: Question):
    db.add(question)
    db.commit()
    db.refresh(question)
    return question

def create_interview(db: Session, interview: Interview):
    db.add(interview)
    db.commit()
    db.refresh(interview)
    return interview

def get_questions_by_user(db: Session, user_id: str):
    return db.query(Question).filter(Question.user_id == user_id).all()


def delete_question(db: Session, question_id: str):
    db.query(Question).filter(Question.question_id == question_id).delete()
    db.commit()


def get_user_basic(db: Session, user_id: str):
    return db.query(User).filter(User.user_id == user_id).first()


def get_user_interviews(db: Session, user_id: str):
    return (
        db.query(Interview)
        .options(joinedload(Interview.questions))
        .filter(Interview.user_id == user_id)
        .all()
    )


def get_user_badges(db: Session, user_id: str):
    return (
        db.query(UserBadge)
        .filter(UserBadge.user_id == user_id)
        .all()
    )


def get_all_badges(db: Session):
    return db.query(Badge).all()


def get_unlocked_badges(db: Session, user_id: str):
    return (
        db.query(Badge)
        .join(UserBadge)
        .filter(UserBadge.user_id == user_id)
        .all()
    )

def unlock_badge(db: Session, user_id: str, badge_id: int):
    new_unlock = UserBadge(
        user_id=user_id,
        badge_id=badge_id,
        unlock_time=current_millis(),
    )
    db.add(new_unlock)
    db.commit()
    db.refresh(new_unlock)
    return new_unlock