#!/usr/bin/env python3
# app/db/db_init.py
"""Utility helpers for initialising and seeding the application database."""

from sqlalchemy import text

from .db_config import engine, Base
from app.services.badge_service import ensure_badges_seeded


def reset_table(table_name: str):
    """Clear the specified table."""
    with engine.connect() as conn:
        conn.execute(text(f"TRUNCATE TABLE {table_name} RESTART IDENTITY CASCADE;"))
        conn.commit()
        print(f"Table '{table_name}' has been truncated.")


def reset_all():
    """Rebuild all tables and seed static data."""
    print("Dropping and recreating all tables...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    ensure_badges_seeded()
    print("All tables reset.")


if __name__ == "__main__":
    reset_all()

