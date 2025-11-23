#!/usr/bin/env python3
# app/db/db_init.py
"""
Initialize PostgreSQL tables using SQLAlchemy ORM.
Usage:
    python -m app.db.db_init
"""
from sqlalchemy import text
from app.db.db_config import engine, Base
from app.db import models
import sys

# def reset_table(table_name: str):
#     """Clear the specified table"""
#     with engine.connect() as conn:
#         conn.execute(text(f"TRUNCATE TABLE {table_name} RESTART IDENTITY CASCADE;"))
#         conn.commit()
#         print(f"Table '{table_name}' has been truncated.")

def reset_table(table_name: str):
    """Clear the specified table. Use TRUNCATE in PostgreSQL, DELETE in SQLite."""
    with engine.connect() as conn:
        if engine.dialect.name == "sqlite":
            # SQLite: TRUNCATE not supported
            conn.execute(text(f"DELETE FROM {table_name};"))
            conn.commit()
            print(f"[SQLite] Table '{table_name}' cleared with DELETE.")
        else:
            # PostgreSQL or others
            conn.execute(text(f"TRUNCATE TABLE {table_name} RESTART IDENTITY CASCADE;"))
            conn.commit()
            print(f"[PostgreSQL] Table '{table_name}' truncated.")

# def reset_all():
#     """Rebuild all tables"""
#     print("Dropping and recreating all tables...")
#     Base.metadata.drop_all(bind=engine)
#     Base.metadata.create_all(bind=engine)
#     print("All tables reset.")

def reset_all():
    """Rebuild all tables safely across SQLite/PostgreSQL."""
    print("Dropping and recreating all tables...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    print("All tables reset.")

def init_db(reset: bool = False):
    """Initialize the database.
    If reset=True, drop all tables before recreating.
    """
    if reset:
        print("Dropping all existing tables...")
        Base.metadata.drop_all(bind=engine)
    print("Creating all tables...")
    Base.metadata.create_all(bind=engine)
    print("Database initialized successfully.")


if __name__ == "__main__":
    reset_all()
    if len(sys.argv) > 1 and sys.argv[1] == "reset":
        init_db(reset=True)
    else:
        init_db(reset=False)

