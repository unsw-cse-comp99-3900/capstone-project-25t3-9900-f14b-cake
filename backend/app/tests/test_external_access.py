# backend/app/tests/test_external_access.py

import pytest
from unittest.mock import patch
from app.external_access import (
    GPTAccessClient,
    VerifyAccessClient
)
from app.external_access.exceptions import (
    GPTAccessError,
    TokenVerifyError,
    InvalidTokenError,
    RequestFailedError,
)

FAKE_JWT = "fake.jwt.token"
FAKE_EMAIL = "test@test.com"
FAKE_GOOGLE_JWT = "google.jwt.token"
FAKE_GPT_URL = "https://fake-gpt.com/api"
FAKE_VERIFY_URL = "https://fake-verify.com/api"


# -------------------------------------------------------
# Automatically mock environment variables
# -------------------------------------------------------
@pytest.fixture(autouse=True)
def mock_env(monkeypatch):
    monkeypatch.setenv("GPT_ACCESS_URL", FAKE_GPT_URL)
    monkeypatch.setenv("GPT_ACCESS_TIMEOUT", "5")
    monkeypatch.setenv("TEST_JWT", FAKE_JWT)

    monkeypatch.setenv("Token_Verify_URL", FAKE_VERIFY_URL)
    monkeypatch.setenv("ACCESS_TIMEOUT", "5")


# =======================================================
#              GPTAccessClient 
# =======================================================

@patch("app.external_access.gpt_access.requests.post")
def test_gpt_access_success(mock_post):
    mock_post.return_value.status_code = 200
    mock_post.return_value.json.return_value = {
        "status": "success",
        "response": {
            "outcome": "OK",
            "answer": "Mocked GPT Answer"
        }
    }

    client = GPTAccessClient(FAKE_JWT)
    result = client.send_prompt("Hello GPT")

    mock_post.assert_called_once()
    assert result["status"] == "OK"
    assert result["answer"] == "Mocked GPT Answer"


@patch("app.external_access.gpt_access.requests.post")
def test_gpt_access_unexpected_format(mock_post):
    mock_post.return_value.status_code = 200
    mock_post.return_value.json.return_value = {"status": "fail"}

    client = GPTAccessClient(FAKE_JWT)

    with pytest.raises(GPTAccessError):
        client.send_prompt("test")


@patch("app.external_access.gpt_access.requests.post")
def test_gpt_access_401(mock_post):
    mock_post.return_value.status_code = 401

    client = GPTAccessClient(FAKE_JWT)

    with pytest.raises(GPTAccessError, match="unauthorized"):
        client.send_prompt("test")


@patch("app.external_access.gpt_access.requests.post")
def test_gpt_access_403(mock_post):
    mock_post.return_value.status_code = 403

    client = GPTAccessClient(FAKE_JWT)

    with pytest.raises(GPTAccessError, match="Token Expired"):
        client.send_prompt("test")


@patch("app.external_access.gpt_access.requests.post")
def test_gpt_access_unexpected_http(mock_post):
    mock_post.return_value.status_code = 500
    mock_post.return_value.text = "Server error"

    client = GPTAccessClient(FAKE_JWT)

    with pytest.raises(RequestFailedError):
        client.send_prompt("test")


# =======================================================
#            VerifyAccessClient 
# =======================================================

@patch("app.external_access.verify_access.requests.post")
def test_verify_access_success(mock_post):
    mock_post.return_value.status_code = 200
    mock_post.return_value.json.return_value = {
        "status": "success",
        "response": {
            "status": "verified",
            "jwt_token": "new.jwt.token"
        }
    }

    client = VerifyAccessClient(
        email=FAKE_EMAIL,
        google_jwt=FAKE_GOOGLE_JWT,
    )

    result = client.token_verify()

    mock_post.assert_called_once()
    assert result["status"] == "verified"
    assert result["jwt_token"] == "new.jwt.token"


@patch("app.external_access.verify_access.requests.post")
def test_verify_access_unexpected_format(mock_post):
    mock_post.return_value.status_code = 200
    mock_post.return_value.json.return_value = {"status": "fail"}

    client = VerifyAccessClient(email=FAKE_EMAIL)

    with pytest.raises(TokenVerifyError):
        client.token_verify()


@patch("app.external_access.verify_access.requests.post")
def test_verify_access_400(mock_post):
    mock_post.return_value.status_code = 400
    mock_post.return_value.json.return_value = {"error": "Invalid token provided"}

    client = VerifyAccessClient(email=FAKE_EMAIL)

    with pytest.raises(InvalidTokenError, match="Invalid token provided"):
        client.token_verify()


@patch("app.external_access.verify_access.requests.post")
def test_verify_access_401(mock_post):
    mock_post.return_value.status_code = 401

    client = VerifyAccessClient(email=FAKE_EMAIL)

    with pytest.raises(InvalidTokenError, match="unauthorized"):
        client.token_verify()


@patch("app.external_access.verify_access.requests.post")
def test_verify_access_unexpected_http(mock_post):
    mock_post.return_value.status_code = 500
    mock_post.return_value.text = "server error"

    client = VerifyAccessClient(email=FAKE_EMAIL)

    with pytest.raises(RequestFailedError):
        client.token_verify()

