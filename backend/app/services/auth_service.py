# app/services/auth_service.py
import base64
import json
from app.external_access.verify_access import VerifyAccessClient
from app.services.user_service import update_user_login
from app.services.utils import with_db_session

def get_user_id(jwt_token: str) -> str:
    parts = jwt_token.split(".")
    if len(parts) != 3:
        raise ValueError("Invalid JWT format")
    
    payload_b64 = parts[1]
    padded = payload_b64 + "=" * (-len(payload_b64) % 4)
    decoded_bytes = base64.urlsafe_b64decode(padded)
    decoded_str = decoded_bytes.decode("utf-8")
    payload = json.loads(decoded_str)
    return str(payload["id"])

def get_user_email(jwt_token: str) -> str:
    parts = jwt_token.split(".")
    if len(parts) != 3:
        raise ValueError("Invalid JWT format")
    
    payload_b64 = parts[1]
    padded = payload_b64 + "=" * (-len(payload_b64) % 4)
    decoded_bytes = base64.urlsafe_b64decode(padded)
    decoded_str = decoded_bytes.decode("utf-8")
    payload = json.loads(decoded_str)
    return str(payload["email"])

def get_user_info(jwt_token: str) -> str:
    parts = jwt_token.split(".")
    if len(parts) != 3:
        raise ValueError("Invalid JWT format")
    
    payload_b64 = parts[1]
    padded = payload_b64 + "=" * (-len(payload_b64) % 4)
    decoded_bytes = base64.urlsafe_b64decode(padded)
    decoded_str = decoded_bytes.decode("utf-8")
    payload = json.loads(decoded_str)
    return payload


@with_db_session
def login(email: str, google_jwt: str = None, apple_jwt: str = None, db = None) -> dict:
    """
    Use third-party login (Google/Apple) to obtain JWT token.
    """
    verify_client = VerifyAccessClient(email, google_jwt, apple_jwt)
    result = verify_client.token_verify()
    jwt_token = result.get("jwt_token")
    if jwt_token:
        user_id = get_user_id(jwt_token)
        update_user_login(db, user_id)
    else:
        user_id = None

    return {"user_id": user_id, "token": jwt_token}
