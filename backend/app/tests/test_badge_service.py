# backend/app/tests/test_badge_service.py

import pytest
from unittest.mock import patch, MagicMock
from app.services import badge_service


# ============================================================
# Fixtures
# ============================================================

@pytest.fixture
def fake_user():
    user = MagicMock()
    # default values
    user.user_id = "u001"
    user.total_questions = 0
    user.total_interviews = 0
    user.total_badges = 0
    user.consecutive_days = 0
    user.xp = 0
    user.total_clarity = 0
    user.total_relevance = 0
    user.total_keyword = 0
    user.total_confidence = 0
    user.total_conciseness = 0
    return user


@pytest.fixture
def fake_badge():
    badge = MagicMock()
    badge.badge_id = 1
    badge.name = "Ice Breaker"
    return badge


# ============================================================
# Test meets_condition()
# ============================================================

def test_meets_condition_ice_breaker(fake_user, fake_badge):
    fake_user.total_questions = 1
    fake_badge.name = "Ice Breaker"
    assert badge_service.meets_condition(fake_user, fake_badge)


def test_meets_condition_fail(fake_user, fake_badge):
    fake_user.total_questions = 0
    fake_badge.name = "Ice Breaker"
    assert badge_service.meets_condition(fake_user, fake_badge) is False


def test_meets_condition_unknown_badge(fake_user, fake_badge):
    fake_badge.name = "Unknown Badge"
    assert badge_service.meets_condition(fake_user, fake_badge) is False


# ============================================================
# Test XP-level badges
# ============================================================

def test_condition_first_steps(fake_user):
    fake_user.xp = 1
    assert badge_service.condition_first_steps(fake_user)


def test_condition_xp_novice(fake_user):
    fake_user.xp = 100
    assert badge_service.condition_xp_novice(fake_user)


def test_condition_xp_expert(fake_user):
    fake_user.xp = 500
    assert badge_service.condition_xp_expert(fake_user)


def test_condition_xp_master(fake_user):
    fake_user.xp = 1000
    assert badge_service.condition_xp_master(fake_user)


# ============================================================
# Test answering progress
# ============================================================

def test_answer_rookie(fake_user):
    fake_user.total_questions = 10
    assert badge_service.condition_answer_rookie(fake_user)


def test_answer_expert(fake_user):
    fake_user.total_questions = 50
    assert badge_service.condition_answer_expert(fake_user)


def test_answer_master(fake_user):
    fake_user.total_questions = 100
    assert badge_service.condition_answer_master(fake_user)


# ============================================================
# Test login streak badges
# ============================================================

def test_persistent(fake_user):
    fake_user.consecutive_days = 3
    assert badge_service.condition_persistent(fake_user)


def test_dedicated(fake_user):
    fake_user.consecutive_days = 7
    assert badge_service.condition_dedicated(fake_user)


def test_relentless(fake_user):
    fake_user.consecutive_days = 30
    assert badge_service.condition_relentless(fake_user)


# ============================================================
# Test dimension average badges
# ============================================================

def test_clarity_champion(fake_user):
    fake_user.total_questions = 1
    fake_user.total_clarity = 90
    assert badge_service.condition_clarity_champion(fake_user)


def test_keyword_wizard(fake_user):
    fake_user.total_questions = 1
    fake_user.total_keyword = 90
    assert badge_service.condition_keyword_wizard(fake_user)


# ============================================================
# Test first session
# ============================================================

def test_first_session(fake_user):
    fake_user.total_interviews = 1
    assert badge_service.condition_first_session(fake_user)


# ============================================================
# Test time-of-day badges (mock _current_hour)
# ============================================================

@patch("app.services.badge_service._current_hour", return_value=23)
def test_night_owl(mock_hour, fake_user):
    assert badge_service.condition_night_owl(fake_user)


@patch("app.services.badge_service._current_hour", return_value=5)
def test_early_bird(mock_hour, fake_user):
    assert badge_service.condition_early_bird(fake_user)


# ============================================================
# Test check_badges_for_user() — no database
# ============================================================

@patch("app.services.badge_service.update_user")
@patch("app.services.badge_service.unlock_badge")
@patch("app.services.badge_service.get_all_badges")
@patch("app.services.badge_service.get_unlocked_badges")
def test_check_badges_for_user(
    mock_get_unlocked,
    mock_get_all,
    mock_unlock,
    mock_update_user,
    fake_user
):
    # User qualifies for Ice Breaker
    fake_user.total_questions = 1

    # currently unlocked badges (empty)
    mock_get_unlocked.return_value = []

    # Available badges include Ice Breaker
    b = MagicMock()
    b.badge_id = 1
    b.name = "Ice Breaker"
    mock_get_all.return_value = [b]

    # Simulate unlock_badge returning badge unlock entry
    mock_unlock.return_value = MagicMock(unlocked_timestamp=123456)

    result = badge_service.check_badges_for_user(fake_user, db=None)

    # Should unlock Ice Breaker
    assert len(result) == 1
    assert result[0].name == "Ice Breaker"

    mock_unlock.assert_called_once()
    mock_update_user.assert_called_once()
