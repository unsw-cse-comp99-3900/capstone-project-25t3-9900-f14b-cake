"""
interview.py
------------
Business logic layer for interview-related operations.
Function-based implementation.
"""
import json
import re
from typing import Any, Dict, List, Optional

from api_gateway import GPTAccessClient, FAQAccessClient
from prompt_builder import (
    build_question_prompt,
    build_feedback_prompt,
    build_multicrit_feedback_prompt,
    build_score_prompt
)

def _find_first_json_object(text: str) -> Optional[str]:
    """
    Return the first balanced JSON object substring found in text, or None.
    Handles nested braces and quoted strings with escapes.
    """
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

        if ch == '"' or ch == "'":
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
    # Extract JSON substring from text using balanced brace scan
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
    if parts:
        return parts
    return [ln.strip() for ln in text.splitlines() if ln.strip()]

def _extract_score_list(text: str) -> Optional[List[int]]:
    """
    Try to extract a list of scores from text:
    - "score: [4, 5, 3]"
    - "scores = 4,5,3"
    - "Score: 4 / 5 / 3"
    """
    if not text:
        return None
    m = re.search(r'\[(\s*\d+(?:\s*,\s*\d+)*\s*)\]', text)
    if m:
        nums = [int(x) for x in re.findall(r'\d+', m.group(0))]
        return nums if nums else None
    m = re.search(r'score[s]?\s*[:=]\s*([0-9,\s/\\|-]+)', text, flags=re.IGNORECASE)
    if m:
        nums = [int(x) for x in re.findall(r'\d+', m.group(1))]
        return nums if nums else None
    return None

def _unwrap_api_answer(answer_text: str) -> str:
    """
    The upstream GPT_ACCESS often nests the real answer inside a JSON string, e.g.:
      answer -> '{"answer": "..."}' or just a quoted string.
    This helper normalizes to a plain string.
    """
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

def interview_start(token: str, job_description: str, question_type: str) -> Dict[str, Any]:
    """
    Generate 3 interview questions for the given job description.
    Return format required by server.py:
    { "interview_questions": [ {interview_id, type, question}, ... ] }
    """

    # Use the updated prompt builder which outputs questions separated by '@' and not numbered
    gpt = GPTAccessClient(token)
    prompt = build_question_prompt(job_description, question_type)

    result = gpt.send_prompt(prompt)
    raw_api_answer = (result or {}).get("answer", "").strip()
    raw = _unwrap_api_answer(raw_api_answer)

    # Questions are expected to be separated by '@' per the new prompt format
    if "@" in raw:
        items = [p.strip() for p in raw.split("@") if p and p.strip()]
    else:
        # Fallback: try numbered/line-based parsing
        items = _split_numbered_items(raw)
    # Minimum fill to 3
    while len(items) < 3:
        items.append("")
        
    # print("some questions to choose")
    return {"interview_questions": items}

def interview_feedback(token: str, interview_question: str, interview_answer: str) -> Dict[str, Any]:
    """
    Generate both structured feedback text and numeric score.
    """
    # Fetch user's profile from FAQ_ACCESS to enrich feedback
    user_info: Dict[str, Any] = {}
    try:
        faq_client = FAQAccessClient(token)
        faq_result = faq_client.get_profile()
        user_info = (faq_result or {}).get("response", {}) or {}
    except Exception:
        # Silently continue if FAQ access fails; feedback will still be generated
        user_info = {}

    # Build feedback prompt with user_info context
    feedback_prompt = build_feedback_prompt(
        question=interview_question,
        answer=interview_answer,
        user_info=user_info
    )

    gpt = GPTAccessClient(token)
    feedback_result = gpt.send_prompt(feedback_prompt)
    feedback_raw_api = (feedback_result or {}).get("answer", "").strip()
    feedback_text = _unwrap_api_answer(feedback_raw_api)

    # # Build score prompt and parse a 0-100 numeric score
    # score_prompt = build_score_prompt(
    #     question=interview_question,
    #     answer=interview_answer
    # )
    # score_result = gpt.send_prompt(score_prompt)
    # score_raw_api = (score_result or {}).get("answer", "").strip()
    # score_text = _unwrap_api_answer(score_raw_api)
    # m = re.search(r"\b(100|\d{1,2})\b", score_text)
    # interview_score: Optional[int] = int(m.group(1)) if m else None

    return {
        "interview_feedback": json.loads(feedback_text)
    }

if __name__ == "__main__":
    job_description = "We are looking for a passionate and skilled Python Developer to join our technical team. You will be responsible for designing, developing, testing, and deploying efficient, scalable, and reliable software solutions. If you are familiar with the Python ecosystem, have a deep understanding of backend development, and enjoy collaborating with cross-functional teams, we encourage you to apply."
    question_type = "Technical"
    JWT_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjE3NjAwMDAzNTc4MzJ4ODkzODA2MjMzMDAzNDg1MDAwIiwiZW1haWwiOiJseWY0Nzc0NDkyMkBnbWFpbC5jb20iLCJpYXQiOjE3NjAwNTQ0ODcsIm5iZiI6MTc2MDA1NDQ4NywiZXhwIjoxNzYyNjQ2NDg3fQ.Bq9XVg2p_bmexvn9vtLpUKeeN3hVijjKiHiLxicCQfU"
    interview_question = "Can you explain the differences between Python 2 and Python 3, and why it is important to use Python 3 for new projects?"
    interview_answer = '''
        The key differences between Python 2 and Python 3 center on string handling, the print statement, and division.
        Strings/Encoding:
            Python 2: Strings are default bytes, leading to messy Unicode errors.
            Python 3: Strings are Unicode by default (for text), cleanly separated from bytes (for data), which resolves encoding issues.
        Syntax:
            Python 2: print is a statement (print "hello").
            Python 3: print() is a function (print("hello")).
        Division:
            Python 2: Integer division results in an integer (5 / 2 = 2).
            Python 3: Division results in a float (5 / 2 = 2.5).
        Why is Python 3 mandatory for new projects?
        Because Python 2 reached End-of-Life (EOL) in 2020 and receives no further official security updates. All major libraries and new language features are exclusively developed for Python 3. Using Python 3 ensures project security and future viability.
    '''
    # print(interview_start(token=JWT_TOKEN, job_description=job_description, question_type=question_type))
    print(interview_feedback(token=JWT_TOKEN, interview_question=interview_question, interview_answer=interview_answer))