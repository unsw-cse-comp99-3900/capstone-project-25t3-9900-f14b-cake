"""
test_badges.py (Answering badges)
---------------------------------
测试回答相关的徽章：
"""

from app.db.db_config import engine, SessionLocal
from app.db.models import Base, User, Badge
from app.db.crud import add_user, update_user, get_unlocked_badges
from app.services.badge_service import check_badges_for_user
from app.services import badge_service


def setup_database():
    """初始化数据库并确保存在回答类徽章"""
    print("Setting up database...")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    needed = [
        ("Ice Breaker", "Answer first question"),
        ("Answer Rookie", "Continuous practice"),
        ("Answer Expert", "Rich experience!"),
        ("Answer Master", "True answering expert"),
    ]
    for name, desc in needed:
        existing = db.query(Badge).filter(Badge.name == name).first()
        if not existing:
            db.add(Badge(name=name, description=desc))
    db.commit()
    print("Database setup complete.\n")
    db.close()


def cleanup_test_user(user_id: str):
    db = SessionLocal()
    user = db.query(User).filter(User.user_id == user_id).first()
    if user:
        db.delete(user)
        db.commit()
    db.close()


def test_ice_breaker_badge():
    """测试 Ice Breaker 徽章 - 回答第一个问题"""
    print("=" * 60)
    print("Test: Ice Breaker Badge (Answer first question)")
    print("=" * 60)

    db = SessionLocal()
    test_user_id = "test_user_ice_breaker"

    # 清理可能存在的测试数据
    cleanup_test_user(test_user_id)

    # 创建测试用户
    user = User(
        user_id=test_user_id,
        user_email="test_ice_breaker@test.com",
        total_questions=0,
    )
    add_user(user, db)
    print(f"✓ Created test user: {test_user_id}")
    print(f"  Initial questions answered: {user.total_questions}")

    # 回答第一个问题
    update_user(test_user_id, {"total_questions": 1}, db)
    user = db.query(User).filter(User.user_id == test_user_id).first()
    print(f"\n✓ Updated questions answered to: {user.total_questions}")

    # Trigger badge check
    newly_unlocked = check_badges_for_user(user)
    print(f"\n✓ Checking badges...")

    # 验证 Ice Breaker 已解锁
    all_unlocked = get_unlocked_badges(test_user_id, db)
    badge_names = [b.name for b in all_unlocked]
    if "Ice Breaker" in badge_names:
        print("\n✅ TEST PASSED: Ice Breaker badge unlocked!")
    else:
        print("\n❌ TEST FAILED: Ice Breaker badge not found")

    # 清理
    cleanup_test_user(test_user_id)
    db.close()
    print()


def _test_threshold_badge(user_id: str, target_count: int, expected_name: str):
    db = SessionLocal()
    cleanup_test_user(user_id)
    user = User(user_id=user_id, user_email=f"{user_id}@test.com", total_questions=0)
    add_user(user, db)
    update_user(user_id, {"total_questions": target_count}, db)
    user = db.query(User).filter(User.user_id == user_id).first()
    check_badges_for_user(user)
    unlocked = get_unlocked_badges(user_id, db)
    names = [b.name for b in unlocked]
    print(f"✓ {user_id}: total_questions={target_count}, badges={names}")
    if expected_name in names:
        print(f"✅ TEST PASSED: {expected_name} unlocked!\n")
    else:
        print(f"❌ TEST FAILED: {expected_name} not unlocked\n")
    cleanup_test_user(user_id)
    db.close()


def test_answer_rookie_badge():
    print("=" * 60)
    print("Test: Answer Rookie (>=10)")
    print("=" * 60)
    _test_threshold_badge("test_user_rookie", 10, "Answer Rookie")


def test_answer_expert_badge():
    print("=" * 60)
    print("Test: Answer Expert (>=50)")
    print("=" * 60)
    _test_threshold_badge("test_user_expert", 50, "Answer Expert")


def test_answer_master_badge():
    print("=" * 60)
    print("Test: Answer Master (>=100)")
    print("=" * 60)
    _test_threshold_badge("test_user_master", 100, "Answer Master")


def test_night_owl_badge():
    print("=" * 60)
    print("Test: Night Owl (>=22:00)")
    print("=" * 60)
    original = badge_service._current_hour
    try:
        badge_service._current_hour = lambda: 23
        _test_threshold_badge("test_user_night_owl", 1, "Night Owl")
    finally:
        badge_service._current_hour = original


def test_early_bird_badge():
    print("=" * 60)
    print("Test: Early Bird (<07:00)")
    print("=" * 60)
    original = badge_service._current_hour
    try:
        badge_service._current_hour = lambda: 6
        _test_threshold_badge("test_user_early_bird", 1, "Early Bird")
    finally:
        badge_service._current_hour = original


def run_tests():
    setup_database()
    test_ice_breaker_badge()
    test_answer_rookie_badge()
    test_answer_expert_badge()
    test_answer_master_badge()
    test_night_owl_badge()
    test_early_bird_badge()


if __name__ == "__main__":
    run_tests()