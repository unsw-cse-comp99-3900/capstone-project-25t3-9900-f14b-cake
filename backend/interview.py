"""
interview.py
------------
Business logic layer for interview-related operations.
Function-based implementation.
"""

from api_gateway import GPTAccessClient
from prompt_builder import (
    build_question_prompt,
    build_feedback_prompt,
    build_score_prompt
)

def interview_start(token):
    print("some questions to choose")

def interview_text_answer(token):
    print("answer interview")

def interview_feedback(token, interview_question, interview_answer):
    print("get interview feedback")