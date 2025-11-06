from pydantic import BaseModel, Field
from typing import Optional

class LoginRequest(BaseModel):
    email: str = Field(description="User's email address", example="user@example.com")
    google_jwt: Optional[str] = Field(
        default=None,
        description="Google JWT token for authentication",
        example="eyJhbGciOiJSUzI1NiIsImtpZCI6IjE4MmU0M..."
    )
    apple_jwt: Optional[str] = Field(
        default=None,
        description="Apple JWT token for authentication",
        example="eyJraWQiOiJlWGF1bm1MIiwiYWxnIjoiUlMyNTYifQ..."
    )

class LoginResponse(BaseModel):
    user_id: str = Field(description="Unique user identifier", example="user_123")
    token: str = Field(
        description="JWT authentication token",
        example="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    )