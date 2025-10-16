import os
import json
import requests
from dotenv import load_dotenv
from typing import Dict, Any
from .exceptions import InvalidTokenError, RequestFailedError, FAQAccessError

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))

class FAQAccessClient:
    """Encapsulates interaction with the GPT_ACCESS API."""

    def __init__(self, jwt_token: str):
        self.api_url = os.getenv("FAQ_ACCESS_URL")
        self.timeout = int(os.getenv("GPT_ACCESS_TIMEOUT", "15"))
        self.jwt_token = jwt_token if jwt_token else os.getenv("TEST_JWT")

        if not self.api_url:
            raise FAQAccessError("FAQ_ACCESS_URL missing in .env file.")
        if not self.jwt_token:
            raise InvalidTokenError("JWT token must be provided when initializing FAQAccessClient.")

        self.headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.jwt_token}"
        }

    def get_profile(self) -> Dict[str, Any]:
        """Send a question to FAQ_ACCESS and return parsed response."""
        try:
            response = requests.post(self.api_url, headers=self.headers, json={}, timeout=self.timeout)
        except requests.exceptions.RequestException as e:
            raise RequestFailedError(f"Network error: {e}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get("status") == "success":
                return {
                    "status": "OK",
                    "response": data["response"]
                }
            else:
                raise FAQAccessError(f"Unexpected response format: {data}")
        elif response.status_code == 401:
            raise FAQAccessError("Profile mismatch or unauthorized access")
        elif response.status_code == 403:
            raise FAQAccessError("User not found or Token Expired")
        else:
            raise RequestFailedError(f"Unexpected HTTP {response.status_code}: {response.text}")





