import os
import json
import requests
from dotenv import load_dotenv
from typing import Dict, Any
from .exceptions import GPTAccessError, InvalidTokenError, RequestFailedError

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))

class GPTAccessClient:
    """Encapsulates interaction with the GPT_ACCESS API."""

    def __init__(self, jwt_token: str):
        self.api_url = os.getenv("GPT_ACCESS_URL")
        self.timeout = int(os.getenv("GPT_ACCESS_TIMEOUT", "15"))
        self.jwt_token = jwt_token if jwt_token else os.getenv("TEST_JWT")

        if not self.api_url:
            raise GPTAccessError("GPT_ACCESS_URL missing in .env file.")
        if not self.jwt_token:
            raise InvalidTokenError("JWT token must be provided when initializing GPTAccessClient.")

        self.headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.jwt_token}"
        }

    def send_prompt(self, question: str) -> Dict[str, Any]:
        """Send a question to GPT_ACCESS and return parsed response."""
        payload = {"question": question}
        try:
            response = requests.post(self.api_url, headers=self.headers, json=payload, timeout=self.timeout)
        except requests.exceptions.RequestException as e:
            raise RequestFailedError(f"Network error: {e}")

        if response.status_code == 200:
            data = response.json()
            if data.get("status") == "success":
                return {
                    "status": "OK",
                    "outcome": data["response"].get("outcome"),
                    "answer": data["response"].get("answer")
                }
            else:
                raise GPTAccessError(f"Unexpected response format: {data}")
        elif response.status_code == 401:
            raise GPTAccessError("Profile mismatch or unauthorized access")
        elif response.status_code == 403:
            raise GPTAccessError("User not found or Token Expired")
        else:
            raise RequestFailedError(f"Unexpected HTTP {response.status_code}: {response.text}")


