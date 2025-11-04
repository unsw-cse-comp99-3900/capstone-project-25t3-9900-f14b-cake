from functools import wraps
from app.db.db_config import SessionLocal

def with_db_session(func):
    """
    Decorator: Automatically creates and closes database sessions for server-layer functions.
    If no database is passed in when calling the function, a new session will be created automatically.
    """
    @wraps(func)
    def wrapper(*args, **kwargs):
        db = kwargs.get("db")
        if db is not None:
            # An external session has been passed in (e.g., a nested call).
            return func(*args, **kwargs)

        db = SessionLocal()
        try:
            kwargs["db"] = db
            result = func(*args, **kwargs)
            db.commit()  # Automatic transaction commit (can be turned off as needed)
            return result
        except Exception:
            db.rollback()
            raise
        finally:
            db.close()
    return wrapper