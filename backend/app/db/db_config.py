# app/db/db_config.py
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/mydb")

# Creating the SQLAlchemy engine
engine = create_engine(DATABASE_URL, echo=False)

# Create a SessionLocal for use in dependency injection or business logic.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
def get_db():
    """
    FastAPI dependency functions are used to provide a database session during a request.
    A new session is created for each request and closed when the request ends.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ORM base class
Base = declarative_base()
