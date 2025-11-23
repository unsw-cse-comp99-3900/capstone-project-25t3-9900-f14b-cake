from textwrap import dedent

def build_answer_prompt(
    question: str,
    user_info: dict | None = None,
    job_description: str | None = None
) -> str:
    """
    Build a prompt for GPT_ACCESS to generate a sample answers to interview questions.

    Args:
        question: The interview question asked.
        user_info: A dict of user details.
    Returns:
        str: A formatted prompt string.
    """
    user_info = user_info or {}
    jd_text = f"\n\nJob Description:\n{job_description}" if job_description else ""

    return dedent(f"""
    Act as an experienced job seeker and answer interview questions.

    Candidate Info:
    - Skills: {user_info.get('skills', 'Unknown')}
    - Education: {user_info.get('education', 'Unknown')}
    - Experience: {user_info.get('experience', 'Unknown')}
    {jd_text}

    Interview Question:
    {question}

    Please output:
    Answer: Answers to interview questions, in the form of strings.
    """).strip()
