# backend/app/tests/test_prompt_builder.py

from app.prompt_builder import (
    build_question_prompt,
    build_feedback_prompt,
    build_multicrit_feedback_prompt,
    build_answer_prompt,
)

JOB_DESCRIPTION = (
    "We are looking for a passionate and skilled Python Developer to join our technical team. "
    "You will be responsible for designing, developing, testing, and deploying efficient, "
    "scalable, and reliable software solutions."
)

QUESTION = (
    "Can you explain the differences between Python 2 and Python 3, "
    "and why it is important to use Python 3 for new projects?"
)

ANSWER = """
The key differences between Python 2 and Python 3 center on string handling, the print statement, and division.
Strings/Encoding:
    Python 2: Strings are default bytes, leading to messy Unicode errors.
    Python 3: Strings are Unicode by default (for text), cleanly separated from bytes (for data).
Syntax:
    Python 2: print is a statement (print "hello").
    Python 3: print() is a function (print("hello")).
Division:
    Python 2: Integer division results in an integer (5 / 2 = 2).
    Python 3: Division results in a float (5 / 2 = 2.5).
""".strip()


def test_build_question_prompt_contains_inputs():
    """build_question_prompt should put job_description and question_type into prompt"""
    question_type = "Technical"
    prompt = build_question_prompt(JOB_DESCRIPTION, question_type, 3)

    # type check
    assert isinstance(prompt, str)
    assert len(prompt) > 0

    # prompt check
    assert JOB_DESCRIPTION in prompt
    assert question_type in prompt


def test_build_feedback_prompt_contains_all_fields():
    """build_feedback_prompt should include question, answer and job_description"""
    prompt = build_feedback_prompt(
        question=QUESTION,
        answer=ANSWER,
        job_description=JOB_DESCRIPTION,
    )

    assert isinstance(prompt, str)
    assert len(prompt) > 0

    assert QUESTION in prompt
    assert ANSWER in prompt
    assert JOB_DESCRIPTION in prompt


def test_build_multicrit_feedback_prompt_contains_all_fields():
    """build_multicrit_feedback_prompt should include question, answer and job_description"""
    prompt = build_multicrit_feedback_prompt(
        question=QUESTION,
        answer=ANSWER,
        job_description=JOB_DESCRIPTION,
    )

    assert isinstance(prompt, str)
    assert len(prompt) > 0

    assert QUESTION in prompt
    assert ANSWER in prompt
    assert JOB_DESCRIPTION in prompt


def test_build_answer_prompt_contains_all_fields():
    """build_answer_prompt should include question, answer and job_description"""
    prompt = build_answer_prompt(
        question=QUESTION,
        job_description=JOB_DESCRIPTION,
    )

    assert isinstance(prompt, str)
    assert len(prompt) > 0

    assert QUESTION in prompt
    assert JOB_DESCRIPTION in prompt