from textwrap import dedent

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
    Returns:
        str: A formatted prompt string.
    """
    user_info = user_info or {}
    jd_text = f"\n\nJob Description:\n{job_description}" if job_description else ""

    return dedent(f"""
    Act as an experienced interviewer. Analyze the candidate's response and provide structured feedback.

    Candidate Info:
    - Skills: {user_info.get('skills', 'Unknown')}
    - Education: {user_info.get('education', 'Unknown')}
    - Experience: {user_info.get('experience', 'Unknown')}
    {jd_text}

    Interview Question:
    {question}

    Candidate Answer:
    {answer}

    Please output:
    Summary: A concise overall summary
    """).strip()
