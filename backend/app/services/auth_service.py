# app/services/auth_service.py
import base64
import json
from app.external_access.verify_access import VerifyAccessClient
from app.services.user_service import create_new_user, update_user_login
from app.db.crud import get_user_basic
from app.services.utils import with_db_session

def get_user_id_and_email(jwt_token: str) -> dict:
    """
    Get user id and email form JWT token.

    Args:
        jwt_token: JWT token to be parsed.
        
    Returns:
        dict: A dict containing id and email.
    """
    parts = jwt_token.split(".")
    if len(parts) != 3:
        raise ValueError("Invalid JWT format")
    
    payload_b64 = parts[1]
    padded = payload_b64 + "=" * (-len(payload_b64) % 4)
    decoded_bytes = base64.urlsafe_b64decode(padded)
    decoded_str = decoded_bytes.decode("utf-8")
    payload = json.loads(decoded_str)
    result = {
        "id": payload["id"],
        "email": payload["email"]
    }
    return result


@with_db_session
def login(email: str, google_jwt: str = None, apple_jwt: str = None, db = None) -> dict:
    """
    Use third-party login (Google/Apple) to obtain JWT token.

    Args:
        email: A string of user email.
        google_jwt: A string of googl jwt token.
        apple_jwt: A string of apple jwt token.
        db: The active SQLAlchemy database session, automatically injected by the @with_db_session decorator.
        
    Returns:
        dict: A dict containing user_id and JWT token.
    """
    verify_client = VerifyAccessClient(email, google_jwt, apple_jwt)
    result = verify_client.token_verify()
    jwt_token = result.get("jwt_token")
    if jwt_token:
        id_email = get_user_id_and_email(jwt_token)
        user_id = id_email["id"]
        user_email = id_email["email"]
        # print(id_email)
        user = get_user_basic(user_id, db)
        if not user:
            print("No user:", user_id)
            user = create_new_user(user_id, user_email, db)
            user = update_user_login(user_id, db)
        else:
            user = update_user_login(user_id, db)
    else:
        user_id = None

    return {"user_id": user_id, "token": jwt_token}
