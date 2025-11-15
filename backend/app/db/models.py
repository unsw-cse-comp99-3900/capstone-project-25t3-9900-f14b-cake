# app/db/models.py
from sqlalchemy import Column, ForeignKey, Integer,String, Text, Float, BigInteger, JSON, DateTime, Date, Boolean
from sqlalchemy.orm import relationship
import time
from datetime import date
from app.db.db_config import Base

def current_millis():
    """Returns the current time in Unix milliseconds."""
    return int(time.time() * 1000)


class Question(Base):
    __tablename__ = "questions"
    question_id = Column(String, primary_key=True, index=True)
    interview_id = Column(String, ForeignKey("interviews.interview_id"), nullable=False)

    question = Column(Text, nullable=False)
    question_type = Column(Text, nullable=False)
    answer = Column(Text)
    feedback = Column(JSON)
    timestamp = Column(BigInteger, default=current_millis)

    interview = relationship("Interview", back_populates="questions")



class Interview(Base):
    __tablename__ = "interviews"
    interview_id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.user_id"), nullable=False)
    interview_type = Column(String, nullable=False)
    job_description = Column(String, nullable=False)
    timestamp = Column(BigInteger, default=current_millis)
    is_like = Column(Boolean, default=False)

    user = relationship("User", back_populates="interviews")
    questions = relationship("Question", back_populates="interview", cascade="all, delete-orphan")



class User(Base):
    __tablename__ = "users"
    user_id = Column(String, primary_key=True, index=True)
    user_email = Column(String, nullable=False)

    interviews = relationship("Interview", back_populates="user", cascade="all, delete-orphan")
    user_badges = relationship("UserBadge", back_populates="user", cascade="all, delete-orphan")

    xp = Column(Integer, default=0)
    total_questions = Column(Integer, default=0)
    total_interviews = Column(Integer, default=0)
    total_badges = Column(Integer, default=0)
    
    total_active_days = Column(Integer, default=0)
    last_active_day = Column(Date, default=date.today)
    consecutive_active_days = Column(Integer, default=0)
    max_consecutive_active_days = Column(Integer, default=0)

    max_clarity = Column(Integer, default=0)
    max_relevance = Column(Integer, default=0)
    max_keyword = Column(Integer, default=0)
    max_confidence = Column(Integer, default=0)
    max_conciseness = Column(Integer, default=0)
    max_overall = Column(Float, default=0.0)

    total_clarity = Column(Integer, default=0)
    total_relevance = Column(Integer, default=0)
    total_keyword = Column(Integer, default=0)
    total_confidence = Column(Integer, default=0)
    total_conciseness = Column(Integer, default=0)
    total_overall = Column(Float, default=0.0)

    target_clarity = Column(Integer, default=0)
    target_relevance = Column(Integer, default=0)
    target_keyword = Column(Integer, default=0)
    target_confidence = Column(Integer, default=0)
    target_conciseness = Column(Integer, default=0)



class Badge(Base):
    __tablename__ = "badge"
    badge_id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False, unique=True)
    description = Column(Text)

    unlocked_users = relationship("UserBadge", back_populates="badge", cascade="all, delete-orphan")



class UserBadge(Base):
    __tablename__ = "user_badges"
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String, ForeignKey("users.user_id", ondelete="CASCADE"))
    badge_id = Column(Integer, ForeignKey("badge.badge_id", ondelete="CASCADE"))
    unlocked_timestamp = Column(BigInteger, default=current_millis)

    user = relationship("User", back_populates="user_badges")
    badge = relationship("Badge", back_populates="unlocked_users")