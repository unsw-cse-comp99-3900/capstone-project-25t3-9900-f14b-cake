# app/services/auth_service.py
from app.external_access.verify_access import VerifyAccessClient

def login(email: str, google_jwt: str = None, apple_jwt: str = None) -> dict:
    """
    Use third-party login (Google/Apple) to obtain JWT token.
    """
    verify_client = VerifyAccessClient(email, google_jwt, apple_jwt)
    result = verify_client.token_verify()
    jwt_token = result.get("jwt_token")

    return {"user_id": email, "token": jwt_token}
