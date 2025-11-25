# backend/app/tests/test_user_service.py

import pytest
from unittest.mock import patch, MagicMock

import app.services.user_service as user_service


FAKE_TOKEN = "fake.jwt"
FAKE_USER_ID = "user123"
FAKE_INTERVIEW_ID = "iv999"


# ============================================================
# Helper fixtures
# ============================================================

@pytest.fixture
def fake_user():
    u = MagicMock()
    u.user_id = FAKE_USER_ID
    u.user_email = "test@example.com"
    u.xp = 10
    u.total_questions = 5
    u.total_interviews = 2
    u.total_active_days = 0
    u.last_active_day = None
    u.consecutive_active_days = 2
    u.max_consecutive_active_days = 2

    u.max_clarity = 1
    u.max_relevance = 2
    u.max_keyword = 3
    u.max_confidence = 4
    u.max_conciseness = 5
    u.max_overall = 4.5

    u.total_clarity = 5
    u.total_relevance = 6
    u.total_keyword = 7
    u.total_confidence = 8
    u.total_conciseness = 9
    u.total_overall = 20.0

    u.target_clarity = 3
    u.target_relevance = 3
    u.target_keyword = 3
    u.target_confidence = 3
    u.target_conciseness = 3

    return u


@pytest.fixture
def fake_interview():
    iv = MagicMock()
    iv.interview_id = FAKE_INTERVIEW_ID
    iv.timestamp = 123456789
    iv.is_like = False
    iv.questions = []
    return iv


@pytest.fixture
def fake_badge():
    b = MagicMock()
    b.badge_id = 1
    b.unlocked_timestamp = 111
    return b


# ============================================================
# get_user_detail
# ============================================================

@patch("app.services.auth_service.get_user_id_and_email")
@patch("app.services.user_service.get_user_interviews")
@patch("app.services.user_service.get_user_badges")
@patch("app.services.user_service.get_user_basic")
def test_get_user_detail(mock_basic, mock_badges, mock_interviews, mock_get_id, fake_user, fake_interview, fake_badge):

    mock_get_id.return_value = {"id": FAKE_USER_ID}
    mock_basic.return_value = fake_user
    mock_interviews.return_value = [fake_interview]
    mock_badges.return_value = [fake_badge]

    result = user_service.get_user_detail(FAKE_TOKEN)

    assert result["user_id"] == FAKE_USER_ID
    assert len(result["interviews"]) == 1
    assert len(result["badges"]) == 1


# ============================================================
# create_new_user
# ============================================================

@patch("app.services.user_service.add_user")
def test_create_new_user(mock_add_user):

    mock_user = MagicMock()
    mock_add_user.return_value = mock_user

    u = user_service.create_new_user("u001", "a@test.com")

    assert u == mock_user
    mock_add_user.assert_called_once()


# ============================================================
# update_user_active
# ============================================================

@patch("app.services.user_service.update_user")
@patch("app.services.user_service.get_user_basic")
def test_update_user_active(mock_basic, mock_update, fake_user):

    fake_user.last_active_day = user_service.date.today()
    mock_basic.return_value = fake_user
    mock_update.return_value = fake_user

    result = user_service.update_user_active(FAKE_USER_ID)

    assert result == fake_user
    mock_update.assert_called_once()



# ============================================================
# get_user_interview_summary
# ============================================================

@patch("app.services.auth_service.get_user_id_and_email")
@patch("app.services.user_service.get_user_basic")
def test_get_user_interview_summary(mock_basic, mock_get_id, fake_user):

    mock_get_id.return_value = {"id": FAKE_USER_ID}
    mock_basic.return_value = fake_user

    result = user_service.get_user_interview_summary(FAKE_TOKEN)

    assert result["avg_clarity"] == fake_user.total_clarity / fake_user.total_questions
    assert "avg_overall" in result


# ============================================================
# get_user_statistics
# ============================================================

@patch("app.services.user_service.UserStatistics.from_db")
@patch("app.services.user_service.get_user_basic")
def test_get_user_statistics(mock_basic, mock_from_db, fake_user):

    mock_basic.return_value = fake_user
    mock_instance = MagicMock()
    mock_from_db.return_value = mock_instance

    result = user_service.get_user_statistics(FAKE_USER_ID)

    assert result == mock_instance
    mock_from_db.assert_called_once()


# ============================================================
# like_interview
# ============================================================

@patch("app.services.auth_service.get_user_id_and_email")
@patch("app.services.user_service.update_interview_like")
def test_like_interview(mock_update_like, mock_get_id):

    mock_get_id.return_value = {"id": FAKE_USER_ID}
    iv_mock = MagicMock()
    iv_mock.interview_id = FAKE_INTERVIEW_ID
    iv_mock.is_like = True
    mock_update_like.return_value = iv_mock

    result = user_service.like_interview(FAKE_TOKEN, FAKE_INTERVIEW_ID)

    assert result["interview_id"] == FAKE_INTERVIEW_ID
    assert result["is_like"] is True


# ============================================================
# set_user_target
# ============================================================

@patch("app.services.utils.with_db_session", lambda f: f)   # no mock argument
@patch("app.services.user_service.get_user_basic")
@patch("app.services.user_service.update_user")
@patch("app.services.auth_service.get_user_id_and_email")
def test_set_user_target(mock_get_id, mock_update, mock_basic):
    
    fake_user = MagicMock()
    fake_user.user_id = FAKE_USER_ID
    fake_user.target_clarity = 4
    fake_user.target_relevance = 3
    fake_user.target_keyword = 2
    fake_user.target_confidence = 5
    fake_user.target_conciseness = 1

    mock_get_id.return_value = {"id": FAKE_USER_ID}
    mock_update.return_value = fake_user

    target_dict = {
        "target_clarity": 4,
        "target_relevance": 3,
        "target_keyword": 2,
        "target_confidence": 5,
        "target_conciseness": 1,
    }

    result = user_service.set_user_target(FAKE_TOKEN, target_dict)

    assert result["target_clarity"] == 4
    assert result["target_relevance"] == 3
    assert result["target_keyword"] == 2
    assert result["target_confidence"] == 5
    assert result["target_conciseness"] == 1


# ============================================================
# get_user_target
# ============================================================

@patch("app.services.auth_service.get_user_id_and_email")
@patch("app.services.user_service.get_user_basic")
def test_get_user_target(mock_basic, mock_get_id, fake_user):

    mock_get_id.return_value = {"id": FAKE_USER_ID}
    mock_basic.return_value = fake_user

    result = user_service.get_user_target(FAKE_TOKEN)

    assert result["target_confidence"] == fake_user.target_confidence
