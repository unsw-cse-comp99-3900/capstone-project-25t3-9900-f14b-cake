#!/usr/bin/env python3
# app/db/db_init.py
"""
Initialize PostgreSQL tables using SQLAlchemy ORM.
Usage:
    python -m app.db.db_init
"""

from .db_config import engine, Base
from . import models

# app/db/db_init.py
from sqlalchemy import text
from .db_config import engine, Base
from . import models

def reset_table(table_name: str):
    """Clear the specified table"""
    with engine.connect() as conn:
        conn.execute(text(f"TRUNCATE TABLE {table_name} RESTART IDENTITY CASCADE;"))
        conn.commit()
        print(f"Table '{table_name}' has been truncated.")

def reset_all():
    """Rebuild all tables"""
    print("Dropping and recreating all tables...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    print("All tables reset.")

if __name__ == "__main__":
    reset_table("questions")

