# backend/app/tests/test_interview_service.py

import pytest
from unittest.mock import patch, MagicMock, ANY

from app.services import interview_service


# ============================================================
#  Helper mocks
# ============================================================

FAKE_TOKEN = "fake.jwt.token"
FAKE_USER_ID = "user123"
FAKE_INTERVIEW_ID = "interview123"


# ============================================================
#  Test interview_start()
# ============================================================

@patch("app.services.interview_service.GPTAccessClient")
@patch("app.services.interview_service.get_user_basic")
@patch("app.services.interview_service.get_user_id_and_email")
@patch("app.services.interview_service.save_interview")
def test_interview_start(
    mock_save_interview,
    mock_get_user_id_email,
    mock_get_user_basic,
    mock_gpt_client
):
    # --- mock external API return ---
    fake_api_answer = {
        "status": "OK",
        "outcome": "success",
        "answer": "Q1 @ Q2 @ Q3"
    }

    mock_instance = MagicMock()
    mock_instance.send_prompt.return_value = fake_api_answer
    mock_gpt_client.return_value = mock_instance

    # --- mock user info ---
    mock_get_user_id_email.return_value = {"id": FAKE_USER_ID}
    mock_get_user_basic.return_value = {"user_id": FAKE_USER_ID}

    # --- execute service ---
    result = interview_service.interview_start(
        FAKE_TOKEN, "Python job", "Technical"
    )

    # --- assertions ---
    assert "interview_id" in result
    assert len(result["interview_questions"]) == 3
    assert result["interview_questions"] == ["Q1", "Q2", "Q3"]

    mock_save_interview.assert_called_once()


# ============================================================
#  Test interview_feedback()
# ============================================================

@patch("app.services.interview_service.GPTAccessClient")
@patch("app.services.interview_service.save_question")
@patch("app.services.interview_service.get_user_basic")
@patch("app.services.interview_service.get_user_id_and_email")
def test_interview_feedback(
    mock_get_user_id_email,
    mock_get_user_basic,
    mock_save_question,
    mock_gpt_client
):
    # --- fake GPT feedback JSON ---
    fake_feedback_raw = {
        "status": "OK",
        "outcome": "success",
        "answer": '{"clarity_structure_score":5,"relevance_score":4}'
    }

    client_instance = MagicMock()
    client_instance.send_prompt.return_value = fake_feedback_raw
    mock_gpt_client.return_value = client_instance

    # --- mock user info ---
    mock_get_user_id_email.return_value = {"id": FAKE_USER_ID}
    mock_get_user_basic.return_value = {"user_id": FAKE_USER_ID}

    # --- run feedback ---
    result = interview_service.interview_feedback(
        FAKE_TOKEN,
        FAKE_INTERVIEW_ID,
        "Technical",
        "What is Python?",
        "A programming language."
    )

    # --- validate ---
    assert "interview_feedback" in result
    assert result["interview_feedback"]["clarity_structure_score"] == 5

    # --- ensure question record saved ---
    mock_save_question.assert_called_once()


# ============================================================
#  Test change_interview_like()
#   (does not need database — mock update_interview_like)
# ============================================================

@patch("app.services.interview_service.update_interview_like")
def test_change_interview_like(mock_update_like):

    mock_update_like.return_value = MagicMock(is_like=True)

    result = interview_service.change_interview_like("abc123")

    assert result == {
        "interview_id": "abc123",
        "is_like": True
    }

    mock_update_like.assert_called_once_with("abc123", ANY)

