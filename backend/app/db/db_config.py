# # app/db/db_config.py
# import os
# from sqlalchemy import create_engine
# from sqlalchemy.orm import sessionmaker, declarative_base
# from functools import wraps
# from dotenv import load_dotenv

# BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
# ENV_PATH = os.path.join(BASE_DIR, ".env")
# load_dotenv(dotenv_path=ENV_PATH)

# DB_USER = os.getenv("POSTGRES_USER")
# DB_PASSWORD = os.getenv("POSTGRES_PASSWORD")
# DB_NAME = os.getenv("POSTGRES_DB")
# DB_HOST = os.getenv("POSTGRES_HOST") 
# DB_PORT = os.getenv("POSTGRES_PORT")
# DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# # Get DATABASE_URL from environment (Render provides this)
# DATABASE_URL = os.getenv(
#     "DATABASE_URL",
#     "postgresql://admin:123456@db:5432/mydb"  # Fallback for local docker-compose
# )

# if DATABASE_URL.startswith("postgres://"):
#     DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# engine = create_engine(DATABASE_URL)

# # Create a SessionLocal for use in dependency injection or business logic.
# SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# # ORM base class
# Base = declarative_base()


# def get_db():
#     """
#     FastAPI dependency functions are used to provide a database session during a request.
#     A new session is created for each request and closed when the request ends.
#     """
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()

# def with_db_session(func):
#     @wraps(func)
#     def wrapper(*args, db=None, **kwargs):
#         if db is not None:
#             return func(*args, db=db, **kwargs)
#         else:
#             session = SessionLocal()
#             try:
#                 result = func(*args, db=session, **kwargs)
#                 session.commit()
#                 return result
#             except Exception:
#                 session.rollback()
#                 raise
#             finally:
#                 session.close()
#     return wrapper




# app/db/db_config.py
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from functools import wraps
from dotenv import load_dotenv

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
ENV_PATH = os.path.join(BASE_DIR, ".env")
load_dotenv(dotenv_path=ENV_PATH)

# ----------------------------------------------------------------------
# IMPORTANT: Detect Testing Mode
# ----------------------------------------------------------------------
IS_TEST = os.getenv("TESTING") == "1"

if IS_TEST:
    # Use SQLite in-memory for pytest
    DATABASE_URL = "sqlite:///:memory:"
else:
    # Normal production / Docker PostgreSQL
    DB_USER = os.getenv("POSTGRES_USER")
    DB_PASSWORD = os.getenv("POSTGRES_PASSWORD")
    DB_NAME = os.getenv("POSTGRES_DB")
    DB_HOST = os.getenv("POSTGRES_HOST")
    DB_PORT = os.getenv("POSTGRES_PORT")

    DATABASE_URL = os.getenv(
        "DATABASE_URL",
        f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    )

    if DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# ----------------------------------------------------------------------
# Create engine
# ----------------------------------------------------------------------
# echo=True It allows you to see the SQL, for debugging purposes.
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if IS_TEST else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# FastAPI dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def with_db_session(func):
    @wraps(func)
    def wrapper(*args, db=None, **kwargs):
        if db is not None:
            return func(*args, db=db, **kwargs)
        else:
            session = SessionLocal()
            try:
                result = func(*args, db=session, **kwargs)
                session.commit()
                return result
            except Exception:
                session.rollback()
                raise
            finally:
                session.close()
    return wrapper
