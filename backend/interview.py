"""
interview.py
------------
Business logic layer for interview-related operations.
Function-based implementation.
"""
import json
from api_gateway import GPTAccessClient
from prompt_builder import (
    build_question_prompt,
    build_feedback_prompt,
    build_score_prompt
)

def interview_start(token):
    JWT_TOKEN = json.get(token["..."])
    job_description = json.get(token)
    question_type = json.get(token)
    prompt = build_question_prompt(job_description, question_type)
    
    gpt_client = GPTAccessClient(JWT_TOKEN)
    result = gpt_client.send_prompt(prompt)
    raw_answer = result["answer"]
    parsed = json.loads(raw_answer)
    final_answer = parsed["answer"]
    return final_answer
    # print("some questions to choose")

def interview_text_answer(token):
    print("answer interview")

def interview_feedback(token, interview_question, interview_answer):
    print("get interview feedback")