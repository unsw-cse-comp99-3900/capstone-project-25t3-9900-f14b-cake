# backend/app/tests/test_db.py

import pytest
import time
from sqlalchemy import inspect, text

from app.db.db_init import init_db, reset_all, reset_table
from app.db.db_config import SessionLocal, engine
from app.db.models import Base, User, Interview, Question, Badge, UserBadge

from app.db.crud import (
    add_user, get_user_basic, update_user,
    add_interview, get_interview, update_interview_like,
    add_question, get_questions_by_user, get_user_interviews,
    get_all_badges, unlock_badge, get_user_badges, get_unlocked_badges
)


# ================================================================
# SQLite Test Environment
# ================================================================
@pytest.fixture(scope="function", autouse=True)
def testing_env(monkeypatch):
    monkeypatch.setenv("TESTING", "1")
    init_db(reset=True)
    yield

@pytest.fixture
def db_session():
    """
    Fresh SQLite DB session for each test.
    """
    Base.metadata.create_all(bind=engine)

    session = SessionLocal()
    try:
        yield session
        session.commit()
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)


# ================================================================
# Table Creation Tests
# ================================================================
def test_init_db_creates_tables():
    init_db(reset=True)
    inspector = inspect(engine)
    tables = set(inspector.get_table_names())

    expected = {"users", "interviews", "questions", "badge", "user_badges"}
    assert expected.issubset(tables)


def test_reset_all_recreates_tables():
    reset_all()
    inspector = inspect(engine)
    tables = set(inspector.get_table_names())

    expected = {"users", "interviews", "questions", "badge", "user_badges"}
    assert expected.issubset(tables)


def test_reset_table_truncates_table(db_session):
    user = User(user_id="truncate01", user_email="t@test.com")
    db_session.add(user)
    db_session.commit()

    assert db_session.query(User).count() == 1

    reset_table("users")
    assert db_session.query(User).count() == 0


# ================================================================
# User CRUD
# ================================================================
def test_add_and_get_user(db_session):
    user = User(
        user_id="u001",
        user_email="test@example.com",
        xp=10
    )
    add_user(user, db_session)
    found = get_user_basic("u001", db_session)

    assert found is not None
    assert found.user_email == "test@example.com"
    assert found.xp == 10


def test_update_user(db_session):
    user = User(
        user_id="u002",
        user_email="update@test.com",
        xp=0
    )
    add_user(user, db_session)

    update_user("u002", {"xp": 50}, db_session)
    new_user = get_user_basic("u002", db_session)

    assert new_user.xp == 50


# ================================================================
# Interview CRUD
# ================================================================
def test_add_and_get_interview(db_session):
    user = User(user_id="u003", user_email="int@test.com")
    add_user(user, db_session)

    interview = Interview(
        interview_id="int003",
        user_id="u003",
        interview_type="Technical",
        job_description="Python dev",
        timestamp=int(time.time() * 1000),
        is_like=False
    )
    add_interview(interview, db_session)

    found = get_interview("int003", db_session)
    assert found is not None
    assert found.interview_type == "Technical"


def test_update_interview_like(db_session):
    user = User(user_id="u004", user_email="like@test.com")
    add_user(user, db_session)

    iv = Interview(
        interview_id="int004",
        user_id="u004",
        interview_type="Behavior",
        job_description="JD",
        timestamp=int(time.time() * 1000),
        is_like=False
    )
    add_interview(iv, db_session)

    updated = update_interview_like("int004", db_session)
    assert updated.is_like is True

    updated2 = update_interview_like("int004", db_session)
    assert updated2.is_like is False


# ================================================================
# Question CRUD
# ================================================================
def test_add_question(db_session):
    user = User(user_id="u005", user_email="q@test.com")
    add_user(user, db_session)

    interview = Interview(
        interview_id="int005",
        user_id="u005",
        interview_type="Tech",
        job_description="JD",
        timestamp=int(time.time() * 1000)
    )
    add_interview(interview, db_session)

    q = Question(
        question_id="q005",
        interview_id="int005",
        question="What is Python?",
        question_type="Tech",
        answer="A language",
        feedback={"clarity": 5},
        timestamp=int(time.time() * 1000)
    )
    add_question(q, db_session)

    iv = get_interview("int005", db_session)
    assert len(iv.questions) == 1



def test_get_user_interviews(db_session):
    user = User(user_id="u007", user_email="multi@test.com")
    add_user(user, db_session)

    iv1 = Interview(
        interview_id="int007_1",
        user_id="u007",
        interview_type="Tech",
        job_description="JD1",
        timestamp=int(time.time() * 1000)
    )
    iv2 = Interview(
        interview_id="int007_2",
        user_id="u007",
        interview_type="Behavior",
        job_description="JD2",
        timestamp=int(time.time() * 1000)
    )

    add_interview(iv1, db_session)
    add_interview(iv2, db_session)

    res = get_user_interviews("u007", db_session)
    assert len(res) == 2


# ================================================================
# Badge + UserBadge
# ================================================================
def test_badges(db_session):
    b1 = Badge(badge_id=1, name="Ice Breaker", description="x")
    b2 = Badge(badge_id=2, name="Rookie", description="x")
    b3 = Badge(badge_id=3, name="Expert", description="x")
    db_session.add_all([b1, b2, b3])
    db_session.commit()

    assert len(get_all_badges(db_session)) == 3

    user = User(user_id="u008", user_email="badge@test.com")
    add_user(user, db_session)

    unlock_badge("u008", 1, db_session)
    unlock_badge("u008", 2, db_session)

    user_badges = get_user_badges("u008", db_session)
    assert len(user_badges) == 2

    unlocked = get_unlocked_badges("u008", db_session)
    assert {b.badge_id for b in unlocked} == {1, 2}
