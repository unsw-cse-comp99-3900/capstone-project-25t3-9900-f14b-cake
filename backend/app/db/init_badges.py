"""
init_badges.py
--------------
初始化徽章数据到数据库
运行方式: python -m app.db.init_badges
"""

from app.db.db_config import SessionLocal
from app.db.models import Badge

def init_badges():
    """初始化所有徽章数据"""
    db = SessionLocal()
    
    badges_data = [
        {
            "name": "First Steps",
            "description": "Start your interview preparation journey"
        },
        
        # 问题回答相关徽章
        {
            "name": "ice breaker",
            "description": "Take the first step!"
        },
        {
            "name": "Answer Rookie",
            "description": "Continuous practice"
        },
        {
            "name": "Answer Expert",
            "description": "Rich experience!"
        },
        {
            "name": "Answer Master",
            "description": "True answering expert"
        },

        # 时间段练习相关徽章
        {
            "name": "Night Owl",
            "description": "Dedicated night worker"
        },
        {
            "name": "Early Bird",
            "description": "Morning motivation"
        },
        
    ]
    
    created_count = 0
    skipped_count = 0
    
    for badge_data in badges_data:
        # 检查徽章是否已存在
        existing = db.query(Badge).filter(Badge.name == badge_data["name"]).first()
        
        if existing:
            print(f"⏭️  Skipped: {badge_data['name']} (already exists)")
            skipped_count += 1
        else:
            badge = Badge(**badge_data)
            db.add(badge)
            print(f"✅ Created: {badge_data['name']}")
            created_count += 1
    
    db.commit()
    db.close()
    
    print(f"\n{'='*60}")
    print(f"Badge initialization complete!")
    print(f"  Created: {created_count}")
    print(f"  Skipped: {skipped_count}")
    print(f"  Total: {created_count + skipped_count}")
    print(f"{'='*60}")


if __name__ == "__main__":
    print("Initializing badges...\n")
    init_badges()

