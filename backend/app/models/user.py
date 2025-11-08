from pydantic import BaseModel, Field
from typing import List

class QuestionDetail(BaseModel):
    question_id: str = Field(
        description="Unique identifier for the question",
        example="q_550e8400-e29b-41d4-a716-446655440000"
    )
    question: str = Field(
        description="The interview question that was asked",
        example="Explain the difference between async and sync functions in Python"
    )
    answer: str = Field(
        description="The candidate's answer to the question",
        example="Async functions allow for non-blocking operations..."
    )
    feedback: dict = Field(
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
    timestamp: int = Field(
        description="Unix timestamp when the question was answered",
        example=1698796800
    )

class InterviewDetail(BaseModel):
    interview_id: str = Field(
        description="Unique identifier for the interview session",
        example="550e8400-e29b-41d4-a716-446655440000"
    )
    interview_time: int = Field(
        description="Unix timestamp when the interview was conducted",
        example=1698796800
    )
    is_like: int = Field(
        description="Whether the interview is liked",
        example=False
    )
    questions: List[QuestionDetail] = Field(
        description="List of questions asked in this interview",
        example=[
            {
                "question_id": "q_550e8400-e29b-41d4-a716-446655440000",
                "question": "What is your experience with Python?",
                "answer": "I have 5 years of experience...",
                "feedback": {
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
                },
                "timestamp": 1698796800
            }
        ]
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
    user_email: str = Field(
        description="User's email address",
        example="user@example.com"
    )
    xp: int = Field(
        description="User's total experience points",
        example=1250
    )
    total_interviews: int = Field(
        description="Total number of interviews completed",
        example=15
    )
    total_questions: int = Field(
        description="Total number of questions answered",
        example=75
    )
    interviews: List[InterviewDetail] = Field(
        description="List of all interviews with their questions",
        example=[
            {
                "interview_id": "550e8400-e29b-41d4-a716-446655440000",
                "interview_time": 1698796800,
                "is_like": False,
                "questions": [
                    {
                        "question_id": "q_550e8400-e29b-41d4-a716-446655440000",
                        "question": "What is your experience with Python?",
                        "answer": "I have 5 years of experience...",
                        "feedback": {
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
                        },
                        "timestamp": 1698796800
                    }
                ]
            }
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
            }
        ]
    )

class UserLikeRequest(BaseModel):
    interview_id: str = Field(
        description="UUID identifier for the interview session",
        example="550e8400-e29b-41d4-a716-446655440000"
    )

class UserLikeResponse(BaseModel):
    is_like: bool = Field(
        description="Whether the interview is liked (added to question bank) or not",
        example=True
    )

class UserInterviewSummaryResponse(BaseModel):
    avg_clarity: float = Field(
        description="Average clarity and structure score across all questions",
        example=4.5
    )
    avg_relevance: float = Field(
        description="Average relevance score across all questions",
        example=4.2
    )
    avg_keyword: float = Field(
        description="Average keyword alignment score across all questions",
        example=4.3
    )
    avg_confidence: float = Field(
        description="Average confidence score across all questions",
        example=4.6
    )
    avg_conciseness: float = Field(
        description="Average conciseness score across all questions",
        example=4.1
    )
    avg_overall: float = Field(
        description="Average overall score across all questions",
        example=4.34
    )