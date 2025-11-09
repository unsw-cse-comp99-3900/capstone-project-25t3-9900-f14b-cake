"""
init_badges.py
--------------
Initialize badge data to database
"""

from app.db.db_config import SessionLocal
from app.db.models import Badge

def init_badges():
    """Initialize all badge data"""
    db = SessionLocal()
    
    badges_data = [
        {
            "name": "First Steps",
            "description": "Start your interview preparation journey"
        },
        # XP progression
        {
            "name": "XP Novice",
            "description": "Reach 100 XP"
        },
        {
            "name": "XP Expert",
            "description": "Reach 500 XP"
        },
        {
            "name": "XP Master",
            "description": "Reach 1000 XP"
        },
        
        # Answer related badges
        {
            "name": "Ice breaker",
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

        # Consecutive login streaks
        {
            "name": "Persistent",
            "description": "3-day login streak"
        },
        {
            "name": "Dedicated",
            "description": "7-day login streak"
        },
        {
            "name": "Relentless",
            "description": "30-day login streak"
        },

        # Dimensional average score
        {
            "name": "Clarity Champion",
            "description": "Clarity dimension avg ≥90%"
        },
        {
            "name": "Relevance Expert",
            "description": "Relevance dimension avg ≥90%"
        },
        {
            "name": "Keyword Wizard",
            "description": "Keyword dimension avg ≥90%"
        },
        {
            "name": "Confidence King/Queen",
            "description": "Confidence dimension avg ≥90%"
        },
        {
            "name": "Conciseness Master",
            "description": "Conciseness dimension avg ≥90%"
        },

        # Session related badges
        {
            "name": "First Session",
            "description": "Complete first interview session"
        },

        # Time-of-day related badges
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
        # Check if badge already exists
        existing = db.query(Badge).filter(Badge.name == badge_data["name"]).first()
        
        if existing:
            print(f"Skipped: {badge_data['name']} (already exists)")
            skipped_count += 1
        else:
            badge = Badge(**badge_data)
            db.add(badge)
            print(f"Created: {badge_data['name']}")
            created_count += 1
    
    db.commit()
    db.close()
    
    print(f"\n{'='*40}")
    print(f"Badge initialization complete!")
    print(f"  Created: {created_count}")
    print(f"  Skipped: {skipped_count}")
    print(f"  Total: {created_count + skipped_count}")
    print(f"{'='*40}")


if __name__ == "__main__":
    print("Initializing badges...\n")
    init_badges()

