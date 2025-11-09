# app/services/user_service.py
from app.db.crud import add_user, update_user, get_user_basic, get_user_interviews, get_user_badges, get_all_badges, get_interview, update_interview_like
from app.db.models import current_millis, User
from app.db.db_config import SessionLocal
from app.services import badge_service
from datetime import datetime, timezone, date
from app.services.utils import with_db_session
from datetime import date

def day_from_millis(ms: int):
    """Convert millisecond timestamps to UTC days integers."""
    return datetime.fromtimestamp(ms / 1000, tz=timezone.utc).date().toordinal()

@with_db_session
def get_user_detail(token: str, db = None):
    """Integrates user basic information, interview records (including questions), and badge unlocking information."""
    from app.services.auth_service import get_user_id_and_email
    id_email = get_user_id_and_email(token)
    user_id = id_email.get("id")
    user = get_user_basic(user_id, db)
    if not user:
        return None

    interviews = get_user_interviews(user_id, db)
    badges = get_user_badges(user_id, db)

    # result = {
    #     "user_id": user.user_id,
    #     "interviews": [
    #         [
    #             {
    #                 "interview_type": q.question_type,
    #                 "interview_question": q.question,
    #                 "interview_answer": q.answer,
    #                 "interview_feedback": dict(q.feedback) if q.feedback else {}
    #             } for q in i.questions
    #         ] for i in interviews if i.questions
    #     ],
    #     "badges": [
    #         {
    #             "badge_id": b.badge_id,
    #             "unlocked_at": b.unlocked_at.isoformat()
    #         } for b in badges
    #     ]
    # }

    result = {
        "user_id": user.user_id,
        "user_email": user.user_email,
        "xp": user.xp,
        "total_interviews": user.total_interviews,
        "total_questions": user.total_questions,
        "interviews": [
            {
                "interview_id": i.interview_id,
                "interview_time": i.timestamp,
                "is_like": i.is_like,
                "questions": [
                    {
                        "question_id": q.question_id,
                        "question": q.question,
                        "answer": q.answer,
                        "feedback": q.feedback,
                        "timestamp": q.timestamp
                    } for q in i.questions
                ]
            } for i in interviews
        ],
        "badges": [
            {
                "badge_id": b.badge_id,
                "unlock_date": b.unlocked_timestamp
            } for b in badges
        ]
    }

    return result


def create_new_user(user_id: str, user_email: str, db = None):
    print("Create new user:", user_id)
    user = User(
        user_id=user_id,
        user_email=user_email,
        xp=0,
        total_questions=0,
        total_interviews=0,
        total_badges=0,
        total_logins=0,
        last_login=date.today(),
        consecutive_days=0,
        max_clarity=0,
        max_relevance=0,
        max_keyword=0,
        max_confidence=0,
        max_conciseness=0,
        total_clarity=0,
        total_relevance=0,
        total_keyword=0,
        total_confidence=0,
        total_conciseness=0,
        total_overall=0.0
    )
    user = add_user(user, db)
    return user


def update_user_login(user_id: str, db = None):
    print("User login:", user_id)
    user = get_user_basic(user_id, db)
    if not user:
        return None
    
    new_login = date.today()
    if (new_login - user.last_login).days == 1 or user.total_logins == 0:
        update_data = {"last_login": new_login, 
                        "consecutive_days": user.consecutive_days + 1,
                        "total_logins": user.total_logins + 1
                        }
    elif (new_login - user.last_login).days > 1:
        update_data = {"last_login": new_login, 
                        "consecutive_days": 1,
                        "total_logins": user.total_logins + 1
                        }
    else:
        update_data = None

    if update_data:
        user = update_user(user_id, update_data, db)
    
    return user



@with_db_session
def get_user_full_detail(token: str, db = None):
    """Integrates user basic information, interview records (including questions), and badge unlocking information."""
    from app.services.auth_service import get_user_id_and_email
    id_email = get_user_id_and_email(token)
    user_id = id_email.get("id")
    user = get_user_basic(user_id, db)
    if not user:
        return None

    interviews = get_user_interviews(user_id, db)
    badges = get_user_badges(user_id, db)
    # Build badge metadata map for name/description lookup
    _all_badges = get_all_badges(db)
    badge_meta_by_id = {b.badge_id: {"name": b.name, "description": b.description} for b in _all_badges}

    full_result = {
        "user_id": user.user_id,
        "user_email": user.user_email,
        "xp": user.xp,
        "total_interviews": user.total_interviews,
        "total_questions": user.total_questions,
        "interviews": [
            {
                "interview_id": i.interview_id,
                "interview_time": i.timestamp,
                "is_like": i.is_like,
                "questions": [
                    {
                        "question_id": q.question_id,
                        "question": q.question,
                        "answer": q.answer,
                        "feedback": q.feedback,
                        "timestamp": q.timestamp
                    } for q in i.questions
                ]
            } for i in interviews
        ],
        "badges": [
            {
                "badge_id": b.badge_id,
                "unlock_date": b.unlocked_timestamp
            } for b in badges
        ]
    }

    return full_result    

@with_db_session
def get_user_interview_summary(token: str, db = None):
    from app.services.auth_service import get_user_id_and_email
    id_email = get_user_id_and_email(token)
    user_id = id_email.get("id")
    user = get_user_basic(user_id, db)
    if not user:
        return None
    
    questions_number = float(user.total_questions)
    if questions_number < 1:
        questions_number = 1
    result = {
        "avg_clarity": user.total_clarity / questions_number,
        "avg_relevance": user.total_relevance / questions_number,
        "avg_keyword": user.total_keyword / questions_number,
        "avg_confidence": user.total_confidence / questions_number,
        "avg_conciseness": user.total_conciseness / questions_number,
        "avg_overall": user.total_overall / questions_number
    }
    return result


class UserStatistics:
    def __init__(self, user, interviews=None, badges=None):
        self.user_id = user.user_id
        self.user_email = user.user_email
        self.xp = user.xp

        self.interviews = [{"interview_id": i.interview_id, "timestamp": i.timestamp} for i in interviews]
        self.badges = [{"badge_id": b.badge_id, "unlocked_timestamp": b.unlocked_timestamp} for b in badges]

        self.total_questions = user.total_questions
        self.total_interviews = user.total_interviews
        self.total_badges = user.total_badges

        self.total_logins = user.total_logins
        self.last_login = user.last_login
        self.consecutive_days = user.consecutive_days

        self.max_clarity = user.max_clarity
        self.max_relevance = user.max_relevance
        self.max_keyword = user.max_keyword
        self.max_confidence = user.max_confidence
        self.max_conciseness = user.max_conciseness
        self.max_overall = user.max_overall

        self.total_clarity = user.total_clarity
        self.total_relevance = user.total_relevance
        self.total_keyword = user.total_keyword
        self.total_confidence = user.total_confidence
        self.total_conciseness = user.total_conciseness
        self.total_overall = user.total_overall


    @classmethod
    @with_db_session
    def from_db(cls, user_id, db = None):
        user = get_user_basic(user_id, db)
        interviews = get_user_interviews(user_id, db)
        badges = get_user_badges(user_id, db)

        if not user:
            raise ValueError(f"User {user_id} not found")
        return cls(user, interviews=interviews, badges=badges)
    
    def show(self):
        print(f"user_id: {self.user_id}")
        print(f"user_email: {self.user_email}")
        print(f"xp: {self.xp}")

        print(f"total_questions: {self.total_questions}")
        print(f"total_interviews: {self.total_interviews}")
        print(f"total_badges: {self.total_badges}")
        print(f"total_logins: {self.total_logins}")
        print(f"last_login: {self.last_login}")
        print(f"consecutive_days: {self.consecutive_days}")

        print(f"max_clarity: {self.max_clarity}")
        print(f"max_relevance: {self.max_relevance}")
        print(f"max_keyword: {self.max_keyword}")
        print(f"max_confidence: {self.max_confidence}")
        print(f"max_conciseness: {self.max_conciseness}")
        print(f"max_overall: {self.max_overall}")

        print(f"total_clarity: {self.total_clarity}")
        print(f"total_relevance: {self.total_relevance}")
        print(f"total_keyword: {self.total_keyword}")
        print(f"total_confidence: {self.total_confidence}")
        print(f"total_conciseness: {self.total_conciseness}")
        print(f"total_overall: {self.total_overall}")

        print("interviews: ")
        for i in self.interviews:
            interview_id = i["interview_id"]
            timestamp = i["timestamp"]
            print(f"    initerview_id: {interview_id}   timestamp: {timestamp}")
        print("badges: ")
        for b in self.badges:
            badge_id = b["badge_id"]
            unlocked_timestamp = b["unlocked_timestamp"]
            print(f"    badge_id: {badge_id}   unlocked_timestamp: {unlocked_timestamp}")

    
    def get_dict(self):
        result = {}

        result["user_id"] = self.user_id
        result["user_email"] = self.user_email
        result["xp"] = self.xp

        result["interviews"] = self.interviews
        result["badges"] = self.badges

        result["total_questions"] = self.total_questions
        result["total_interviews"] = self.total_interviews
        result["total_badges"] = self.total_badges

        result["total_logins"] = self.total_logins
        result["last_login"] = self.last_login
        result["consecutive_days"] = self.consecutive_days

        result["max_clarity"] = self.max_clarity
        result["max_relevance"] = self.max_relevance
        result["max_keyword"] = self.max_keyword
        result["max_confidence"] = self.max_confidence
        result["max_conciseness"] = self.max_conciseness
        result["max_overall"] = self.max_overall

        result["total_clarity"] = self.total_clarity
        result["total_relevance"] = self.total_relevance
        result["total_keyword"] = self.total_keyword
        result["total_confidence"] = self.total_confidence
        result["total_conciseness"] = self.total_conciseness
        result["total_overall"] = self.total_overall

        return result



def get_user_statistics(user_id: str):
    user_statistics = UserStatistics.from_db(user_id)
    return user_statistics


@with_db_session
def like_interview(token, interview_id, db = None):
    from app.services.auth_service import get_user_id_and_email
    id_email = get_user_id_and_email(token)
    user_id = id_email.get("id")
    interview = update_interview_like(interview_id, db)
    
    print(f"User: {user_id} change interview {interview_id} is_like value to {interview.is_like}.")
    result = {
        "interview_id": interview.interview_id,
        "is_like": interview.is_like
    }
    return result
