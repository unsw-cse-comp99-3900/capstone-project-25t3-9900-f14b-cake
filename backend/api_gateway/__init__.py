"""
api_gateway
-----------
Gateway module for connecting to external APIs such as GPT_ACCESS.
"""

from .gpt_access import GPTAccessClient

__all__ = ["GPTAccessClient"]