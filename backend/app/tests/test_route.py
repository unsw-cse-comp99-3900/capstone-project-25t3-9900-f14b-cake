# backend/app/tests/test_routes.py

import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from app.main import app

# Create test client
client = TestClient(app)

# ============================================================
#  Test Data
# ============================================================

FAKE_TOKEN = "fake.jwt.token"
FAKE_USER_ID = "user123"
FAKE_INTERVIEW_ID = "550e8400-e29b-41d4-a716-446655440000"


# ============================================================
#  Fixtures
# ============================================================

@pytest.fixture
def auth_headers():
    """Fixture for authentication headers"""
    return {"Authorization": f"Bearer {FAKE_TOKEN}"}


# ============================================================
#  Root endpoint
# ============================================================

def test_root_endpoint():
    """Test GET / returns status ok"""
    response = client.get("/")
    
    assert response.status_code == 200
    assert response.json() == {
        "status": "ok",
        "message": "Interview API is running"
    }


# ============================================================
#  Authentication Routes
# ============================================================

@patch("app.api.auth.login")
def test_login_success(mock_login):
    """Test POST /login with valid credentials"""
    mock_login.return_value = {
        "user_id": FAKE_USER_ID,
        "token": FAKE_TOKEN
    }
    
    response = client.post(
        "/login",
        json={
            "email": "test@example.com",
            "google_jwt": "mock_google_jwt"
        }
    )
    
    assert response.status_code == 200
    data = response.json()
    assert "user_id" in data
    assert "token" in data
    assert data["token"] == FAKE_TOKEN


def test_login_missing_email():
    """Test POST /login without email returns 422"""
    response = client.post(
        "/login",
        json={
            "google_jwt": "mock_token"
        }
    )
    
    assert response.status_code == 422


@patch("app.api.auth.login")
def test_login_service_error(mock_login):
    """Test POST /login when service raises exception"""
    mock_login.side_effect = Exception("Service error")
    
    response = client.post(
        "/login",
        json={
            "email": "test@example.com",
            "google_jwt": "mock_token"
        }
    )
    
    assert response.status_code == 500


# ============================================================
#  Interview Routes
# ============================================================

@patch("app.api.interview.interview_start")
@patch("app.api.interview.get_token")
def test_interview_start_success(mock_get_token, mock_interview_start, auth_headers):
    """Test POST /interview/start with valid data"""
    mock_get_token.return_value = FAKE_TOKEN
    mock_interview_start.return_value = {
        "interview_id": FAKE_INTERVIEW_ID,
        "interview_questions": [
            "What is Python?",
            "Explain async/await",
            "What is a decorator?"
        ]
    }
    
    response = client.post(
        "/interview/start",
        headers=auth_headers,
        json={
            "job_description": "Senior Python Developer",
            "question_type": "technical"
        }
    )
    
    assert response.status_code == 200
    data = response.json()
    assert "interview_id" in data
    assert "interview_questions" in data
    assert len(data["interview_questions"]) == 3


def test_interview_start_missing_auth():
    """Test POST /interview/start without auth token returns 403"""
    response = client.post(
        "/interview/start",
        json={
            "job_description": "Python Developer",
            "question_type": "technical"
        }
    )
    
    assert response.status_code == 403


@patch("app.api.interview.get_token")
def test_interview_start_missing_fields(mock_get_token, auth_headers):
    """Test POST /interview/start with missing required fields"""
    mock_get_token.return_value = FAKE_TOKEN
    
    response = client.post(
        "/interview/start",
        headers=auth_headers,
        json={
            "job_description": "Python Developer"
            # missing question_type
        }
    )
    
    assert response.status_code == 422


@patch("app.api.interview.interview_feedback")
@patch("app.api.interview.get_token")
def test_interview_feedback_success(mock_get_token, mock_feedback, auth_headers):
    """Test POST /interview/feedback with valid data"""
    mock_get_token.return_value = FAKE_TOKEN
    mock_feedback.return_value = {
        "interview_feedback": {
            "clarity_structure_score": 5,
            "clarity_structure_feedback": "Well organized",
            "relevance_score": 4,
            "relevance_feedback": "Relevant answer",
            "keyword_alignment_score": 4,
            "keyword_alignment_feedback": "Good keywords",
            "confidence_score": 5,
            "confidence_feedback": "Confident",
            "conciseness_score": 4,
            "conciseness_feedback": "Concise",
            "overall_summary": "Great answer",
            "overall_score": 4.4
        }
    }
    
    response = client.post(
        "/interview/feedback",
        headers=auth_headers,
        json={
            "interview_id": FAKE_INTERVIEW_ID,
            "interview_type": "technical",
            "interview_question": "What is Python?",
            "interview_answer": "Python is a programming language"
        }
    )
    
    assert response.status_code == 200
    data = response.json()
    assert "interview_feedback" in data
    assert data["interview_feedback"]["overall_score"] == 4.4


def test_interview_feedback_missing_auth():
    """Test POST /interview/feedback without auth returns 403"""
    response = client.post(
        "/interview/feedback",
        json={
            "interview_id": FAKE_INTERVIEW_ID,
            "interview_type": "technical",
            "interview_question": "What is Python?",
            "interview_answer": "Python is great"
        }
    )
    
    assert response.status_code == 403


# ============================================================
#  User Routes
# ============================================================

@patch("app.api.user.get_user_detail")
@patch("app.api.user.get_token")
def test_user_detail_success(mock_get_token, mock_get_detail, auth_headers):
    """Test GET /user/detail returns user data"""
    mock_get_token.return_value = FAKE_TOKEN
    mock_get_detail.return_value = {
        "user_id": FAKE_USER_ID,
        "user_email": "test@example.com",
        "xp": 1250,
        "total_interviews": 15,
        "total_questions": 75,
        "total_active_days": 10,
        "last_active_day": "2025-01-15",
        "consecutive_active_days": 5,
        "max_consecutive_active_days": 10,
        "interviews": [],
        "badges": []
    }
    
    response = client.get(
        "/user/detail",
        headers=auth_headers
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["user_id"] == FAKE_USER_ID
    assert data["xp"] == 1250


def test_user_detail_missing_auth():
    """Test GET /user/detail without auth returns 403"""
    response = client.get("/user/detail")
    
    assert response.status_code == 403


@patch("app.api.user.like_interview")
@patch("app.api.user.get_token")
def test_user_like_success(mock_get_token, mock_like, auth_headers):
    """Test POST /user/like toggles interview like status"""
    mock_get_token.return_value = FAKE_TOKEN
    mock_like.return_value = {
        "interview_id": FAKE_INTERVIEW_ID,
        "is_like": True
    }
    
    response = client.post(
        "/user/like",
        headers=auth_headers,
        json={
            "interview_id": FAKE_INTERVIEW_ID
        }
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["is_like"] is True


@patch("app.api.user.get_user_interview_summary")
@patch("app.api.user.get_token")
def test_user_interview_summary_success(mock_get_token, mock_summary, auth_headers):
    """Test GET /user/interview_summary returns average scores"""
    mock_get_token.return_value = FAKE_TOKEN
    mock_summary.return_value = {
        "avg_clarity": 4.5,
        "avg_relevance": 4.2,
        "avg_keyword": 4.3,
        "avg_confidence": 4.6,
        "avg_conciseness": 4.1,
        "avg_overall": 4.34
    }
    
    response = client.get(
        "/user/interview_summary",
        headers=auth_headers
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["avg_overall"] == 4.34
    assert "avg_clarity" in data


@patch("app.api.user.get_user_interview_summary")
@patch("app.api.user.get_token")
def test_user_interview_summary_no_data(mock_get_token, mock_summary, auth_headers):
    """Test GET /user/interview_summary when user not found"""
    mock_get_token.return_value = FAKE_TOKEN
    mock_summary.return_value = None
    
    response = client.get(
        "/user/interview_summary",
        headers=auth_headers
    )
    
    assert response.status_code == 404


@patch("app.services.auth_service.get_user_id_and_email")  # Patch where it's defined
@patch("app.api.user.get_user_statistics")
@patch("app.api.user.get_token")
def test_user_statistics_success(mock_get_token, mock_stats, mock_get_id, auth_headers):
    """Test GET /user/statistics returns comprehensive stats"""
    mock_get_token.return_value = FAKE_TOKEN
    mock_get_id.return_value = {"id": FAKE_USER_ID}
    
    mock_user_stats = MagicMock()
    mock_user_stats.get_dict.return_value = {
        "user_id": FAKE_USER_ID,
        "user_email": "test@example.com",
        "xp": 1250,
        "interviews": [],
        "badges": [],
        "total_questions": 75,
        "total_interviews": 15,
        "total_badges": 5,
        "total_active_days": 42,
        "last_active_day": "2024-11-08",
        "consecutive_active_days": 7,
        "max_consecutive_active_days": 15,
        "max_clarity": 5,
        "max_relevance": 5,
        "max_keyword": 5,
        "max_confidence": 5,
        "max_conciseness": 5,
        "max_overall": 4.8,
        "total_clarity": 320,
        "total_relevance": 310,
        "total_keyword": 315,
        "total_confidence": 330,
        "total_conciseness": 305,
        "total_overall": 325.5,
        "target_clarity": 5,
        "target_relevance": 5,
        "target_keyword": 5,
        "target_confidence": 5,
        "target_conciseness": 5
    }
    
    mock_stats.return_value = mock_user_stats
    
    response = client.get(
        "/user/statistics",
        headers=auth_headers
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["xp"] == 1250
    assert data["total_questions"] == 75


@patch("app.api.user.set_user_target")
@patch("app.api.user.get_token")
def test_user_set_target_success(mock_get_token, mock_set_target, auth_headers):
    """Test POST /user/target sets user goals"""
    mock_get_token.return_value = FAKE_TOKEN
    mock_set_target.return_value = {
        "user_id": FAKE_USER_ID,
        "target_clarity": 5,
        "target_relevance": 5,
        "target_keyword": 4,
        "target_confidence": 5,
        "target_conciseness": 4
    }
    
    response = client.post(
        "/user/target",
        headers=auth_headers,
        json={
            "target_clarity": 5,
            "target_relevance": 5,
            "target_keyword": 4,
            "target_confidence": 5,
            "target_conciseness": 4
        }
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["target_clarity"] == 5


@patch("app.api.user.get_token")
def test_user_set_target_invalid_range(mock_get_token, auth_headers):
    """Test POST /user/target with invalid score range"""
    mock_get_token.return_value = FAKE_TOKEN
    
    response = client.post(
        "/user/target",
        headers=auth_headers,
        json={
            "target_clarity": 10,  # Invalid: max is 5
            "target_relevance": 5,
            "target_keyword": 4,
            "target_confidence": 5,
            "target_conciseness": 4
        }
    )
    
    assert response.status_code == 422


@patch("app.api.user.get_user_target")
@patch("app.api.user.get_token")
def test_user_get_target_success(mock_get_token, mock_get_target, auth_headers):
    """Test GET /user/target retrieves user goals"""
    mock_get_token.return_value = FAKE_TOKEN
    mock_get_target.return_value = {
        "user_id": FAKE_USER_ID,
        "target_clarity": 5,
        "target_relevance": 5,
        "target_keyword": 4,
        "target_confidence": 5,
        "target_conciseness": 4
    }
    
    response = client.get(
        "/user/target",
        headers=auth_headers
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["target_clarity"] == 5


# ============================================================
#  Error Handling Tests
# ============================================================

def test_invalid_endpoint():
    """Test calling non-existent endpoint returns 404"""
    response = client.get("/nonexistent")
    
    assert response.status_code == 404


@patch("app.api.interview.interview_start")
@patch("app.api.interview.get_token")
def test_service_exception_handling(mock_get_token, mock_start, auth_headers):
    """Test that service exceptions are properly handled"""
    mock_get_token.return_value = FAKE_TOKEN
    mock_start.side_effect = Exception("Database error")
    
    response = client.post(
        "/interview/start",
        headers=auth_headers,
        json={
            "job_description": "Python Developer",
            "question_type": "technical"
        }
    )
    
    assert response.status_code == 500
    data = response.json()
    assert "detail" in data or "message" in data


# ============================================================
#  CORS Tests
# ============================================================

def test_cors_headers_present():
    """Test that CORS headers are set correctly"""
    response = client.options(
        "/login",
        headers={
            "Origin": "http://localhost:3000",
            "Access-Control-Request-Method": "POST"
        }
    )
    
    assert response.status_code == 200
    assert "access-control-allow-origin" in response.headers


# ============================================================
#  Validation Tests
# ============================================================

def test_login_with_empty_email():
    """Test login with empty email string"""
    response = client.post(
        "/login",
        json={
            "email": "",
            "google_jwt": "token"
        }
    )
    
    assert response.status_code in [422, 500]


@patch("app.api.interview.interview_start")
@patch("app.api.interview.get_token")
def test_interview_start_with_empty_job_description(mock_get_token, mock_start, auth_headers):
    """Test interview start with empty job description"""
    mock_get_token.return_value = FAKE_TOKEN
    mock_start.return_value = {
        "interview_id": FAKE_INTERVIEW_ID,
        "interview_questions": ["Q1", "Q2", "Q3"]
    }
    
    response = client.post(
        "/interview/start",
        headers=auth_headers,
        json={
            "job_description": "",
            "question_type": "technical"
        }
    )
    
    assert response.status_code == 200