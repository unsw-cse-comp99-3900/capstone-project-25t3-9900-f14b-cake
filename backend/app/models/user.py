from pydantic import BaseModel, Field
from typing import List

class QuestionDetail(BaseModel):
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
    interview_feedback: dict = Field(
        description="Detailed feedback with scores for the answer",
        example={
            "clarity_structure_score": 5,
            "clarity_structure_feedback": "Well organized response...",
            "relevance_score": 4,
            "relevance_feedback": "Addresses the question directly...",
            "keyword_alignment_score": 4,
            "keyword_alignment_feedback": "Good use of technical terms...",
            "confidence_score": 5,
            "confidence_feedback": "Confident delivery...",
            "conciseness_score": 4,
            "conciseness_feedback": "Concise and to the point...",
            "overall_summary": "Strong answer overall...",
            "overall_score": 4.4
        }
    )

class BadgeDetail(BaseModel):
    badge_id: int = Field(
        description="Badge identifier",
        example=1
    )
    unlock_date: int = Field(
        description="Unix timestamp when the badge was unlocked",
        example=1698796800
    )

class UserDetailResponse(BaseModel):
    user_id: str = Field(
        description="Unique user identifier",
        example="550e8400-e29b-41d4-a716-446655440000"
    )
    interviews: List[List[QuestionDetail]] = Field(
        description="List of interviews, where each interview contains a list of questions with answers and feedback",
        example=[
            [
                {
                    "interview_type": "technical",
                    "interview_question": "What is your experience with Python?",
                    "interview_answer": "I have 5 years of experience...",
                    "interview_feedback": {
                        "clarity_structure_score": 5,
                        "clarity_structure_feedback": "Well organized...",
                        "relevance_score": 4,
                        "relevance_feedback": "Relevant to the question...",
                        "keyword_alignment_score": 4,
                        "keyword_alignment_feedback": "Good keywords...",
                        "confidence_score": 5,
                        "confidence_feedback": "Confident...",
                        "conciseness_score": 4,
                        "conciseness_feedback": "Concise...",
                        "overall_summary": "Strong answer...",
                        "overall_score": 4.4
                    }
                }
            ]
        ]
    )
    badges: List[BadgeDetail] = Field(
        description="List of badges earned by the user",
        example=[
            {
                "badge_id": 1,
                "unlock_date": 1698796800
            },
            {
                "badge_id": 2,
                "unlock_date": 1699401600
            },
            {
                "badge_id": 1,
                "unlock_date": 1700006400
            }
        ]
    )