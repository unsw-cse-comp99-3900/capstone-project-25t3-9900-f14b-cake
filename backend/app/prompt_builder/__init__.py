"""
prompt_builder
--------------
A lightweight prompt generation toolkit for GPT_ACCESS API.

Functions:
- build_question_prompt(job_description, question_type)
- build_feedback_prompt(question, answer, user_info, job_description)
- build_score_prompt(question, answer, criteria, job_description)
"""

from .question_builder import build_question_prompt
from .feedback_builder import build_feedback_prompt, build_multicrit_feedback_prompt
from .answer_builder import build_answer_prompt

__all__ = [
    "build_question_prompt", 
    "build_feedback_prompt", 
    "build_multicrit_feedback_prompt", 
    "build_answer_prompt"
    ]