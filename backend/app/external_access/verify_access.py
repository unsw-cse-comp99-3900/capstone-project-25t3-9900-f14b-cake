import os
import json
import requests
from dotenv import load_dotenv
from typing import Dict, Any
from .exceptions import TokenVerifyError, InvalidTokenError, RequestFailedError

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))

class VerifyAccessClient:
    """Encapsulates interaction with the Token_Verify API."""

    def __init__(self, email: str, google_jwt: str | None = None, apple_jwt: str | None = None):
        self.api_url = os.getenv("Token_Verify_URL")
        self.timeout = int(os.getenv("ACCESS_TIMEOUT", "15"))
        self.email = email
        self.google_jwt = google_jwt
        self.apple_jwt = apple_jwt

        if not self.api_url:
            raise TokenVerifyError("Token_Verify missing in .env file.")
        if not self.email:
            raise InvalidTokenError("Email must be provided when initializing GPTAccessClient.")

        self.headers = {
            "Content-Type": "application/json",
        }

        self.payload = {
            "email": self.email,
            "google_jwt": self.google_jwt,
            "apple_jwt": self.apple_jwt
        }


    def token_verify(self) -> Dict[str, Any]:
        """Send a question to Token_Verify and return parsed response."""
        try:
            response = requests.post(self.api_url, headers=self.headers, json=self.payload, timeout=self.timeout)
        except requests.exceptions.RequestException as e:
            raise RequestFailedError(f"Network error: {e}")

        if response.status_code == 200:
            data = response.json()
            if data.get("status") == "success":
                return {
                    "status": data["response"].get("status"),
                    "jwt_token": data["response"].get("jwt_token"),
                }
            else:
                raise TokenVerifyError(f"Unexpected response format: {data}")
        elif response.status_code == 400:
            info = response.json()
            error_info = info.get("error")
            raise InvalidTokenError(f"{error_info}")
        elif response.status_code == 401:
            raise InvalidTokenError("Profile mismatch or unauthorized access.")
        else:
            raise RequestFailedError(f"Unexpected HTTP {response.status_code}: {response.text}")


