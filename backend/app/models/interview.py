from pydantic import BaseModel, Field
from typing import List

class InterviewStartRequest(BaseModel):
    job_description: str = Field(
        description="Detailed job description for the interview",
        example="Senior Python Developer with 5+ years experience in FastAPI, PostgreSQL, and AWS"
    )
    question_type: str = Field(
        description="Type of interview question",
        example="technical"
    )

class InterviewFeedbackRequest(BaseModel):
    interview_id: str = Field(
        description="UUID identifier for the interview session",
        example="550e8400-e29b-41d4-a716-446655440000"
    )
    interview_type: str = Field(
        description="Type of the interview",
        example="technical"
    )
    interview_question: str = Field(
        description="The interview question that was asked",
        example="Explain the difference between async and sync functions in Python"
    )
    interview_answer: str = Field(
        description="The candidate's answer to the question",
        example="Async functions allow for non-blocking operations..."
    )

class InterviewStartResponse(BaseModel):
    interview_id: str = Field(
        description="UUID identifier for the interview session",
        example="550e8400-e29b-41d4-a716-446655440000"
    )
    interview_questions: List[str] = Field(
        description="List of generated interview questions",
        example=[
            "Tell me about your experience with Python and FastAPI",
            "How do you handle error handling in REST APIs?",
            "What's your approach to database optimization?"
        ]
    )

class InterviewFeedbackResponse(BaseModel):
    interview_feedback: dict = Field(
        description="Detailed feedback breakdown with scores and comments for each criterion",
        example={
            "clarity_structure_score": 5,
            "clarity_structure_feedback": "The response is well-organized, with clear sections addressing each aspect of the question.",
            "relevance_score": 5,
            "relevance_feedback": "The answer directly addresses the differences between Python 2 and 3 and emphasizes the importance of using Python 3, which is highly relevant.",
            "keyword_alignment_score": 4,
            "keyword_alignment_feedback": "The candidate used relevant technical terms, but could further enhance alignment by mentioning specific libraries or frameworks commonly used in Python 3.",
            "confidence_score": 4,
            "confidence_feedback": "The tone is confident and knowledgeable, though a bit more enthusiasm could enhance the delivery.",
            "conciseness_score": 4,
            "conciseness_feedback": "The answer is mostly concise, but could be slightly tightened by reducing redundancy in explanations.",
            "overall_summary": "Overall, the candidate demonstrated a strong understanding of the differences between Python 2 and 3, effectively communicating their importance for new projects. To improve, the candidate could incorporate more specific examples of libraries and maintain a more dynamic tone throughout.",
            "overall_score": 4.4
        }
    )