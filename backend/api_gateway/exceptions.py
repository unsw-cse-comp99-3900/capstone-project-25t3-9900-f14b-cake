class GPTAccessError(Exception):
    """Base exception for GPT_ACCESS errors."""
    pass

class InvalidTokenError(GPTAccessError):
    """Raised when JWT token is missing or invalid."""
    pass

class RequestFailedError(GPTAccessError):
    """Raised when a network or HTTP error occurs."""
    pass
