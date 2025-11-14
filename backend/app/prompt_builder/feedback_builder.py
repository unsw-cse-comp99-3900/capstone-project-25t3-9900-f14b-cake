from textwrap import dedent
from typing import List

CRITERIA_ORDER: List[str] = [
    "Clarity & Structure",
    "Relevance to Question / Job",
    "Keyword & Skill Alignment",
    "Confidence & Delivery",
    "Conciseness & Focus",
]

SHORT_RUBRIC = """ 
    Scoring Guide: 5 = Excellent, 4 = Good, 3 = Average, 2 = Weak, 1 = Poor.
    - Clarity & Structure: logical flow and organization
    - Relevance: how well it answers the question and matches the job
    - Keyword Alignment: presence of role-related skills or terms
    - Confidence: tone, pacing, and fluency
    - Conciseness: focus and brevity
""".strip()

RUBRIC_TEXT = """
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
    """.strip()

def build_feedback_prompt(
    question: str,
    answer: str,
    user_info: dict | None = None,
    job_description: str | None = None
) -> str:
    """
    Build a prompt for GPT_ACCESS to generate structured feedback for a candidate's answer.

    Args:
        question: The interview question asked.
        answer: The candidate's answer text.
        user_info: A dict of user details.
        job_description: The text of job description.
    Returns:
        str: A formatted prompt string.
    """
    user_info = user_info or {}
    jd_text = job_description if job_description else "Unknown"
    rubric = SHORT_RUBRIC

    return dedent(f"""
    Act as an experienced interviewer. Analyze the candidate's response and provide structured feedback.

    Candidate Info:
    - Skills: {user_info.get('skills', 'Unknown')}
    - Education: {user_info.get('education', 'Unknown')}
    - Experience: {user_info.get('experience', 'Unknown')}
    
    Job Description
    {jd_text}

    Interview Question:
    {question}

    Candidate Answer:
    {answer}

    Rubric:
    {rubric}
    
    For each dimension, provide both a score and a brief feedback sentence(One or two sentences).
    Finally, write an overall_summary paragraph describing the overall impression of the answer and top improvement suggestions.

    Return the result in the following JSON format exactly:
    {{"clarity_structure_score": "int",
    "clarity_structure_feedback": "string",
    "relevance_score": "int",
    "relevance_feedback": "string",
    "keyword_alignment_score": "int",
    "keyword_alignment_feedback": "string",
    "confidence_score": "int",
    "confidence_feedback": "string",
    "conciseness_score": "int",
    "conciseness_feedback": "string",
    "overall_summary": "string",
    "overall_score": "float"}}
    """).strip()


def build_multicrit_feedback_prompt(
    question: str,
    answer: str,
    user_info: dict | None = None,
    job_description: str | None = None
) -> str:
    """
    Build a prompt for GPT_ACCESS to generate structured multicrit feedback for a candidate's answer.

    Args:
        question: The interview question asked.
        answer: The candidate's answer text.
        user_info: A dict of user details.
        job_description: The text of job description.
    Returns:
        str: A formatted prompt string.
    """
    user_info = user_info or {}
    jd_text = job_description if job_description else "Unknown"
    # criteria = "\n".join([f"- {c}" for c in CRITERIA_ORDER])

    return dedent(f"""
    Act as an experienced interviewer. Analyze the candidate's response and provide structured feedback.

    Candidate Info:
    - Skills: {user_info.get('skills', 'Unknown')}
    - Education: {user_info.get('education', 'Unknown')}
    - Experience: {user_info.get('experience', 'Unknown')}
    
    Job Description
    {jd_text}

    Interview Question:
    {question}

    Candidate Answer:
    {answer}

    Rubric (1=Poor, 5=Excellent):
    {RUBRIC_TEXT}

    For each dimension, provide both a score and a brief feedback sentence(One or two sentences).
    Finally, write an overall_summary paragraph describing the overall impression of the answer and top improvement suggestions.

    Return the result in the following JSON format exactly:
    {{"clarity_structure_score": "int",
    "clarity_structure_feedback": "string",
    "relevance_score": "int",
    "relevance_feedback": "string",
    "keyword_alignment_score": "int",
    "keyword_alignment_feedback": "string",
    "confidence_score": "int",
    "confidence_feedback": "string",
    "conciseness_score": "int",
    "conciseness_feedback": "string",
    "overall_summary": "string",
    "overall_score": "float"}}
    """).strip()

