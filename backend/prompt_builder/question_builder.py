def build_question_prompt(job_description: str, question_type: str) -> str:
    """
    Build a prompt asking GPT_ACCESS to generate an interview question.
    Args:
        job_description: str - Description of the job position.
        question_type: str - Type of question (technical, behavioral, situational, etc.)
    Returns:
        str: A formatted prompt string.
    """
    return (
        f"Generate 3 {question_type} interview questions based on the following job description:\n\n"
        f"{job_description}\n\n"
        "The question should be clear, relevant, and help evaluate the candidate's suitability for the role."
    )
