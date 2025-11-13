# app/services/interview_service.py
import json
import re
from typing import Any, Dict, List, Optional
import uuid
import time
from app.db.crud import add_interview, add_question, get_user_basic, update_user, update_interview_like 
from app.db.models import Question, Interview
from app.external_access.gpt_access import GPTAccessClient
from app.external_access.faq_access import FAQAccessClient
from app.services.auth_service import get_user_id_and_email
from app.services.badge_service import check_badges_for_user
from app.prompt_builder import build_question_prompt, build_feedback_prompt
from app.services.utils import with_db_session

# ---------------------------
# Database Functions
# ---------------------------
def save_interview(user_id: str, interview_id: str, interview_type: str, job_description: str, db = None):
    """
    The interview process stores the interview results in the database and updates the user information.

    Args:
        user_id: A string of user_id.
        interview_id: A string of interview_id, it is a UUID.
        interview_type: A string of interview types.
        job_description: A string of job description.
        db: The active SQLAlchemy database session.
        
    Returns:
        interview: A SQLAlchemy entry of interview, if it is None, means fails.
    """
    print(f"Saving interview for user={user_id}")
    timestamp = int(time.time() * 1000)
    new_interview = Interview(interview_id=interview_id, 
                              user_id=user_id, 
                              interview_type=interview_type, 
                              job_description=job_description,
                              timestamp=timestamp,
                              is_like=False)
    interview = add_interview(new_interview, db)
    if not interview:
        return None
    user = get_user_basic(user_id, db)
    if not user:
        return None
    user_data = {"total_interviews": interview.user.total_interviews + 1}
    user = update_user(user_id, user_data, db)
    print(f"Saved interview: {interview_id}")
    return interview


def save_question(user_id: str, interview_id: str, question_type: str, question_text: str, answer: str, feedback: dict, db = None):
    """
    The question process stores the interview results in the database and updates the user information.

    Args:
        user_id: A string of user_id.
        interview_id: A string of interview_id, it is a UUID.
        question_type: A string of question types, which is the same as interview_type.
        question_text: A string of question test.
        answer: A string of answer text.
        feedback: A dict of feedback of answer, including scores.
        db: The active SQLAlchemy database session.
        
    Returns:
        dict: A SQLAlchemy entry of interview, if it is None, means fails.
    """
    print(f"Saving question for user={user_id}, interview={interview_id}")
    timestamp = int(time.time() * 1000)
    question_id = f"{interview_id}_{timestamp}"
    question = Question(question_id=question_id,
                            interview_id=interview_id,
                            question=question_text,
                            question_type=question_type,
                            answer=answer,
                            feedback=feedback,
                            timestamp=timestamp
                            )
    new_question = add_question(question, db)
    print(f"Saved question: {new_question.question_id}")
    if not new_question:
        return None
    
    user = get_user_basic(user_id, db)
    if not user:
        return None
    clarity = feedback.get("clarity_structure_score", 0)
    relevance = feedback.get("relevance_score", 0)
    keyword = feedback.get("keyword_alignment_score", 0)
    confidence = feedback.get("confidence_score", 0)
    conciseness = feedback.get("conciseness_score", 0)
    overall = feedback.get("overall_score", 0.0)

    user_data = {
        "xp": user.xp + int(overall * 2),
        "total_questions": user.total_questions + 1,
        "total_clarity": user.total_clarity + clarity,
        "total_relevance": user.total_relevance + relevance,
        "total_keyword": user.total_keyword + keyword,
        "total_confidence": user.total_confidence + confidence,
        "total_conciseness": user.total_conciseness + conciseness,
        "total_overall": user.total_overall + overall
        }
    if clarity > user.max_clarity:
        user_data["max_clarity"] = clarity
    if relevance > user.max_relevance:
        user_data["max_relevance"] = relevance
    if keyword > user.max_keyword:
        user_data["max_keyword"] = keyword
    if confidence > user.max_confidence:
        user_data["max_confidence"] = confidence
    if conciseness > user.max_conciseness:
        user_data["max_conciseness"] = conciseness
    if overall > user.total_overall:
        user_data["max_overall"] = overall
    
    user = update_user(user_id, user_data, db)
    print("Update user after feedback.")
    if not user:
        return None
    else:
        print("Try to check badges")
        newly_unlocked = check_badges_for_user(user, db)
        if not newly_unlocked:
            print("Not unlock new badges")

    return question

# ---------------------------
# Internal Helper Functions
# ---------------------------

def _find_first_json_object(text: str) -> Optional[str]:
    if not text:
        return None
    in_string = False
    string_quote = ''
    escape_next = False
    depth = 0
    start_index: Optional[int] = None
    for i, ch in enumerate(text):
        if in_string:
            if escape_next:
                escape_next = False
                continue
            if ch == "\\":
                escape_next = True
                continue
            if ch == string_quote:
                in_string = False
            continue
        if ch in ('"', "'"):
            in_string = True
            string_quote = ch
            continue
        if ch == '{':
            if depth == 0:
                start_index = i
            depth += 1
            continue
        if ch == '}':
            if depth > 0:
                depth -= 1
                if depth == 0 and start_index is not None:
                    return text[start_index : i + 1]
    return None


def _extract_json_block(text: str) -> Optional[dict]:
    if not text:
        return None
    try:
        return json.loads(text)
    except Exception:
        pass
    json_sub = _find_first_json_object(text)
    if not json_sub:
        return None
    try:
        return json.loads(json_sub)
    except Exception:
        return None


def _split_numbered_items(text: str) -> List[str]:
    if not text:
        return []
    parts = re.split(r'(?:^|\n)\s*\d+\.\s*', text.strip())
    parts = [p.strip() for p in parts if p and p.strip()]
    return parts or [ln.strip() for ln in text.splitlines() if ln.strip()]


def _unwrap_api_answer(answer_text: str) -> str:
    if not answer_text:
        return ""
    try:
        parsed = json.loads(answer_text)
        if isinstance(parsed, dict) and "answer" in parsed:
            inner = parsed.get("answer")
            return inner if isinstance(inner, str) else json.dumps(inner, ensure_ascii=False)
        if isinstance(parsed, str):
            return parsed
    except Exception:
        pass
    return answer_text

# ---------------------------
# Main Business Logic
# ---------------------------
@with_db_session
def change_interview_like(interview_id: str, db = None):
    """
    Invert the is_like field of the determined interview.

    Args:
        interview_id: A string of interview_id, it is a UUID.
        db: The active SQLAlchemy database session, automatically injected by the @with_db_session decorator.
        
    Returns:
        dict: A dict interview_id and new is_like value.
    """
    interview = update_interview_like(interview_id, db)
    result = {
        "interview_id": interview_id,
        "is_like": interview.is_like
    }
    return result

@with_db_session
def interview_start(token: str, job_description: str, question_type: str, db = None) -> Dict[str, Any]:
    """
    Generate some interview questions for the given job description.

    Args:
        token: A string of JWT token.
        job_description: A string of job description.
        question_type: A string of question type, the same meaning of interview type.
        db: The active SQLAlchemy database session, automatically injected by the @with_db_session decorator.
        
    Returns:
        dict: A dict interview_id and a list of interview questions.
    """
    gpt = GPTAccessClient(token)
    prompt = build_question_prompt(job_description, question_type)
    result = gpt.send_prompt(prompt)
    raw_api_answer = (result or {}).get("answer", "").strip()
    raw = _unwrap_api_answer(raw_api_answer)

    if "@" in raw:
        items = [p.strip() for p in raw.split("@") if p and p.strip()]
    else:
        items = _split_numbered_items(raw)

    while len(items) < 3:
        items.append("")

    id_email = get_user_id_and_email(token)
    user_id = id_email["id"]
    interview_id = str(uuid.uuid4())
    save_interview(user_id=user_id, 
                   interview_id=interview_id, 
                   interview_type=question_type, 
                   job_description=job_description,
                   db=db
                   )

    return {"interview_id": interview_id, "interview_questions": items}

@with_db_session
def interview_feedback(token: str, interview_id: str, interview_type: str, interview_question: str, interview_answer: str, db = None) -> Dict[str, Any]:
    """
    Generate feedback and a 5-element score list.

    Args:
        token: A string of JWT token.
        interview_id: A string of interview id.
        interview_type: A string of interview type, the same meaning of question type.
        interview_question: A string of interview question text, here is just only one question.
        interview_answer: A string of answer text.
        db: The active SQLAlchemy database session, automatically injected by the @with_db_session decorator.
        
    Returns:
        dict: A dict interview_feedback, this is actually a feedback on only one question.
    """
    user_info: Dict[str, Any] = {}
    try:
        # faq_client = FAQAccessClient(token)
        # faq_result = faq_client.get_profile()
        # user_info = (faq_result or {}).get("response", {}) or {}
        user_info = {}
    except Exception:
        user_info = {}

    feedback_prompt = build_feedback_prompt(
        question=interview_question,
        answer=interview_answer,
        user_info=user_info,
    )

    gpt = GPTAccessClient(token)
    feedback_result = gpt.send_prompt(feedback_prompt)
    feedback_raw_api = (feedback_result or {}).get("answer", "").strip()

    try:
        parsed_feedback = json.loads(feedback_raw_api)
    except Exception:
        parsed_feedback = {}

    id_email = get_user_id_and_email(token)
    user_id = id_email["id"]
    save_question(user_id, interview_id, interview_type, interview_question, interview_answer, parsed_feedback, db)

    return {
        "interview_feedback": parsed_feedback
    }
