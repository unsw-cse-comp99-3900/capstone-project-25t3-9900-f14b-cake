"""
api_gateway
-----------
Gateway module for connecting to external APIs such as GPT_ACCESS, FAQ_ACCESS.
"""

from .gpt_access import GPTAccessClient
from .faq_access import FAQAccessClient

__all__ = ["GPTAccessClient", "FAQAccessClient"]