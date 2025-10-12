"""
interview.py
------------
Business logic layer for interview-related operations.
Function-based implementation.
"""
import json
import re
from typing import Any, Dict, List, Optional

from api_gateway import GPTAccessClient
from prompt_builder import (
    build_question_prompt,
    build_feedback_prompt,
    build_score_prompt
)

JSON_BLOCK_RE = re.compile(r'(\{(?:[^{}]|(?1))*\})', re.DOTALL)

def _extract_json_block(text: str) -> Optional[dict]:
    if not text:
        return None
    try:
        return json.loads(text)
    except Exception:
        pass
    # Extract JSON substring from text
    m = JSON_BLOCK_RE.search(text)
    if not m:
        return None
    try:
        return json.loads(m.group(1))
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

def interview_start(token: str, job_description: str) -> Dict[str, Any]:
    """
    Generate 3 interview questions for the given job description.
    Return format required by server.py:
    { "interview_questions": [ {interview_id, type, question}, ... ] }
    """
    question_type = "technical"

    # Use the existing prompt builder and constrain the output to 3 numbered questions
    base_prompt = build_question_prompt(job_description, question_type)
    prompt = (
        f"{base_prompt}\n\n"
        "Now output EXACTLY 3 questions, numbered 1., 2., 3., one per line. "
        "Return plain text only."
    )

    gpt = GPTAccessClient(token)
    result = gpt.send_prompt(prompt)
    raw = (result or {}).get("answer", "").strip()

    items = _split_numbered_items(raw)
    # Minimum fill to 3
    while len(items) < 3:
        items.append("")

    questions = [
        {"interview_id": i + 1, "type": question_type, "question": q}
        for i, q in enumerate(items[:3])
    ]
    return {"interview_questions": questions}
    # print("some questions to choose")

def interview_text_answer(token: str) -> Dict[str, Any]:
    """
    Generate a sample answer text (plain text).
    Here is a general example answer to the STAR method.
    Return format required by server.py:
    { "interview_answer": "<plain text>" }
    """
    prompt = (
        "You are an experienced interview coach. "
        "Provide a concise, strong sample answer using the STAR method to a typical "
        "software engineering interview question about resolving a difficult technical issue. "
        "Use 150–220 words. No markdown, no lists. Return plain text only."
    )

    gpt = GPTAccessClient(token)
    result = gpt.send_prompt(prompt)
    raw = (result or {}).get("answer", "").strip()

    return {"interview_answer": raw}
    # print("answer interview")

def interview_feedback(token: str, interview_question: str, interview_answer: str) -> Dict[str, Any]:
    """
    Generate both structured feedback text and numeric score.
    """
    # build prompt
    prompt = build_feedback_prompt(
        question=interview_question,
        answer=interview_answer
    )

    gpt = GPTAccessClient(token)
    result = gpt.send_prompt(prompt)
    raw = (result or {}).get("answer", "").strip()

    # Try extracting the JSON result
    data = _extract_json_block(raw)
    if isinstance(data, dict):
        feedback = data.get("feedback", "")
        score = data.get("score", [])
        return {
            "interview_feedback": feedback or raw,
            "interview_score": score or None
        }

    # Use regular expression to match the number list
    score_list = _extract_score_list(raw)
    if score_list:
        feedback = re.sub(r'(?i)score[s]?\s*[:=].*', '', raw).strip()
        return {
            "interview_feedback": feedback,
            "interview_score": score_list
        }

    # If all else fails, return to the original text.
    return {
        "interview_feedback": raw,
        "interview_score": None
    }