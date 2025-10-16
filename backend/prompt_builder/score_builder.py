# scoring_prompts.py
from textwrap import dedent
from typing import List, Optional

CRITERIA_ORDER: List[str] = [
    "Clarity & Structure",
    "Relevance to Question / Job",
    "Keyword & Skill Alignment",
    "Confidence & Delivery",
    "Conciseness & Focus",
]

RUBRIC_TEXT = dedent("""
Criterion
5 (Excellent)
4 (Good)
3 (Average)
2 (Weak)
1 (Poor)

Clarity & Structure
- 5: Extremely clear, logical flow; uses STAR or numbered format naturally.
- 4: Mostly clear and logical; minor tangents.
- 3: Understandable but lacks structure or order.
- 2: Hard to follow; scattered points.
- 1: Disorganized, confusing, no clear flow.

Relevance to Question / Job
- 5: Fully relevant; directly answers the question using examples tied to the JD.
- 4: Mostly relevant; minor off-topic points.
- 3: Partially relevant; general or vague.
- 2: Often off-topic; weak link to role.
- 1: Irrelevant; fails to address question.

Keyword & Skill Alignment
- 5: Strong use of job-specific and industry keywords naturally.
- 4: Includes some relevant keywords; moderate alignment.
- 3: Few role-related terms; mostly generic language.
- 2: Poor alignment; missing key skills.
- 1: No relevant terminology; generic or incorrect usage.

Confidence & Delivery
- 5: Confident, fluent tone; steady pacing; minimal fillers.
- 4: Generally confident; minor pauses or fillers.
- 3: Uneven pacing; some hesitation or filler use.
- 2: Hesitant or monotone; frequent fillers.
- 1: Unconfident, unclear tone; distracting fillers or stammering.

Conciseness & Focus
- 5: Succinct, focused, stays on point.
- 4: Slightly wordy but mostly focused.
- 3: Average length; occasional repetition.
- 2: Overly long or repetitive; loses focus.
- 1: Rambling; off-topic; unclear message.
""").strip()


def build_score_prompt(
    question: str,
    answer: str,
    job_description: Optional[str] = None,
) -> str:
    """
    Build a prompt that requests a STRICT JSON list of five 1–5 scores in a fixed order.
    """
    jd_text = f"\n\nJob Description:\n{job_description}" if job_description else ""
    criteria_bullets = "\n".join([f"- {c}" for c in CRITERIA_ORDER])

    return dedent(f"""
    You are an experienced interviewer. Evaluate the candidate's answer using the rubric below.

    Interview Question:
    {question}

    Candidate Answer:
    {answer}
    {jd_text}

    Criteria (in this exact order):
    {criteria_bullets}

    Rubric (1=Poor, 5=Excellent):
    {RUBRIC_TEXT}

    Output format (IMPORTANT):
    - Return ONLY a JSON array of exactly five integers (each 1-5), in the SAME order as the criteria above.
    - Do not include any text before or after the JSON. Examples of valid outputs:
      [5,4,4,5,4]
      [3,3,3,3,3]
    """).strip()