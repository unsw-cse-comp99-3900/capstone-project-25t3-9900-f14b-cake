# app/services/interview_service.py
import json
import re
from typing import Any, Dict, List, Optional
import uuid
import time
from app.db.crud import create_interview, create_question, get_user_basic
from app.db.models import Question, Interview
from app.external_access.gpt_access import GPTAccessClient
from app.external_access.faq_access import FAQAccessClient
from app.services.auth_service import get_user_id
from app.prompt_builder import build_question_prompt, build_feedback_prompt


# ---------------------------
# Database Functions
# ---------------------------
def update_max(user, feedback, field_name, key_in_feedback):
    if key_in_feedback in feedback:
        new_score = feedback[key_in_feedback]
        current_score = getattr(user, field_name)
        if new_score > (current_score or 0):
            setattr(user, field_name, new_score)

def update_user_after_interview(db, user_id: str, interview_id: str):
    user = get_user_basic(db, user_id)
    if not user:
        return None
    user.total_interviews += 1

    db.commit()
    db.refresh(user)
    return user


def update_user_after_feedback(db, user_id: str, feedback: dict):
    user = get_user_basic(db, user_id)
    if not user:
        return None
    user.total_questions += 1
    update_max(user, feedback, "max_clarity", "clarity_structure_score")
    update_max(user, feedback, "max_relevance", "relevance_score")
    update_max(user, feedback, "max_keyword", "keyword_score")
    update_max(user, feedback, "max_confidence", "confidence_score")
    update_max(user, feedback, "max_conciseness", "conciseness_score")

    db.commit()
    db.refresh(user)
    return user


def save_interview(db, user_id: str, interview_id: str):
    """Save a interview result as a Interview record."""
    interview_entry = Interview(
        interview_id=interview_id,
        user_id=user_id,
    )

    create_interview(interview_entry)

    return interview_entry


def save_feedback(db, user_id: str, interview_id: str, question_text: str, answer_text: str, feedback_data: dict):
    """Save a feedback result as a Question record."""
    question_id = f"{interview_id}_{int(time.time() * 1000)}"

    question_entry = Question(
        question_id=question_id,
        interview_id=interview_id,
        user_id=user_id,
        question=question_text,
        answer=answer_text,
        feedback=feedback_data,
    )

    create_question(question_entry)
    update_user_after_feedback(db, user_id, feedback_data)

    return question_entry


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

def interview_start(token: str, job_description: str, question_type: str) -> Dict[str, Any]:
    """
    Generate 3 interview questions for the given job description.
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

    user_id = get_user_id(token)
    interview_id = str(uuid.uuid4())
    save_interview(user_id=user_id, interview_id=interview_id)

    return {"interview_id": interview_id, "interview_questions": items}


def interview_feedback(token: str, interview_question: str, interview_answer: str, interview_id: str) -> Dict[str, Any]:
    """
    Generate feedback and a 5-element score list.
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

    user_id = get_user_id(token)
    save_feedback(user_id=user_id, 
                  interview_id=interview_id, 
                  question_text=interview_question, 
                  answer_text=interview_answer, 
                  feedback_data=parsed_feedback)

    return {
        "interview_feedback": parsed_feedback
    }
