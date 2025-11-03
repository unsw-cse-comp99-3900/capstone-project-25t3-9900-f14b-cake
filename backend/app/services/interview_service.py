# app/services/interview_service.py
import json
import re
from typing import Any, Dict, List, Optional
import uuid
from app.external_access.gpt_access import GPTAccessClient
from app.external_access.faq_access import FAQAccessClient
from app.prompt_builder import (
    build_question_prompt,
    build_feedback_prompt,
    build_multicrit_feedback_prompt,
)

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

    interview_id = str(uuid.uuid4())

    return {"interview_id": interview_id, "interview_questions": items}


def interview_feedback(token: str, interview_question: str, interview_answer: str) -> Dict[str, Any]:
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

    return {
        "interview_feedback": parsed_feedback
    }
