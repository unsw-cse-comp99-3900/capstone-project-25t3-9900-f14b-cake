"""
test_db_basic.py
----------------
纯 Python 版本的数据库基本功能测试：
1. 测试数据库连接
2. 创建表
3. 插入、查询、删除
4. 清理表
"""

from sqlalchemy import text
from app.db.db_config import engine, SessionLocal
from app.db.models import Base, Question
from app.db.crud import create_question, get_questions_by_user, delete_question


def test_database_connection():
    """Test database connection"""
    print("Testing database connection...")
    with engine.connect() as conn:
        result = conn.execute(text("SELECT 1"))
        assert result.scalar() == 1
    print("Database connection successful.\n")


def test_create_tables():
    """Create table structure"""
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully.\n")


def test_insert_query_delete():
    """Insert, Query, Delete"""
    db = SessionLocal()

    test_data = {
        "question_id": "test_q001",
        "interview_id": "test_i001",
        "user_id": "test_u001",
        "question": "What motivates you?",
        "answer": "I enjoy solving challenging problems.",
        "feedback": {"clarity": 5, "depth": 4}
    }

    print("Inserting test record...")
    q = create_question(db, test_data)
    print(f"Inserted: {q.question_id}")

    print("Querying test record...")
    results = get_questions_by_user(db, "test_u001")
    assert len(results) >= 1
    print(f"Found {len(results)} record(s).")

    print("Deleting test record...")
    delete_question(db, "test_q001")
    results = get_questions_by_user(db, "test_u001")
    assert len(results) == 0
    print("Record deleted successfully.\n")

    db.close()


def test_drop_tables():
    """Clean up the table structure"""
    print("Dropping all tables...")
    Base.metadata.drop_all(bind=engine)
    print("Tables dropped successfully.\n")


if __name__ == "__main__":
    print("Running manual database tests...\n")

    test_database_connection()
    test_create_tables()
    test_insert_query_delete()
    test_drop_tables()

    print("All database tests passed successfully!")
