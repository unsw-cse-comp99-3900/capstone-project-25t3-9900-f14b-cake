from textwrap import dedent

def build_score_prompt(
    question: str,
    answer: str,
    criteria: list[str] | None = None,
    job_description: str | None = None
) -> str:
    """
    Build a prompt asking GPT_ACCESS to evaluate a candidate's answer and give a numeric score (0-100).

    Args:
        question: The interview question.
        answer: The candidate's answer.
        criteria: Optional list of evaluation criteria (default: clarity, logic, technical depth, role fit).

    Returns:
        str: A formatted prompt string suitable for GPT_ACCESS.
    """
    default_criteria = [
        "clarity and coherence",
        "logical structure",
        "technical accuracy or depth",
        "communication effectiveness",
        "relevance to the question",
        "fit for the target role"
    ]
    criteria = criteria or default_criteria
    criteria_text = "\n".join([f"- {c}" for c in criteria])
    jd_text = f"\n\nJob Description:\n{job_description}" if job_description else ""

    return dedent(f"""
    You are an experienced interviewer. Evaluate the candidate's answer on a 0-100 scale.

    Interview Question:
    {question}

    Candidate Answer:
    {answer}
    {jd_text}

    Evaluation Criteria:
    {criteria_text}

    Please output:
    - A numeric score (0-100)
    """).strip()
