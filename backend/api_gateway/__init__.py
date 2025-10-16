"""
api_gateway
-----------
Gateway module for connecting to external APIs such as GPT_ACCESS, FAQ_ACCESS.
"""

from .gpt_access import GPTAccessClient
from .faq_access import FAQAccessClient
from .verify_access import VerifyAccessClient

__all__ = ["GPTAccessClient", "FAQAccessClient", "VerifyAccessClient"]