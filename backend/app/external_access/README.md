
api_gateway module

This module is mainly used to build a bridge between the backend server of this project and the third-party API to shield the leakage of the third-party API.

The specific third-party API connection is stored in the .env file.



Detailed description

This module mainly contains the following files:
exceptions.py  faq_access.py  gpt_access.py  README.md  requirements.txt  test.py


How to use:
GPTAccessClient:
Receive a JWT token as authorization to access the JobGen API.
The send_prompt function is used to send a request to GPT. The specific prompt of the request is received by question.
example:
gpt_client = GPTAccessClient(JWT_TOKEN)  # initialization
ask_GPT_question = "Your Question"
