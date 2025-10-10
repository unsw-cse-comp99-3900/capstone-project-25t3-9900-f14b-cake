import json
from api_gateway.gpt_access import GPTAccessClient


# JWT Token
JWT_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjE3NjAwMDAzNTc4MzJ4ODkzODA2MjMzMDAzNDg1MDAwIiwiZW1haWwiOiJseWY0Nzc0NDkyMkBnbWFpbC5jb20iLCJpYXQiOjE3NjAwNTQ0ODcsIm5iZiI6MTc2MDA1NDQ4NywiZXhwIjoxNzYyNjQ2NDg3fQ.Bq9XVg2p_bmexvn9vtLpUKeeN3hVijjKiHiLxicCQfU"

def test_gpt():
    question = "Generate 3 job interview questions for a software engineer position. Split each questions by @"
    gpt_client = GPTAccessClient(JWT_TOKEN)
    result = gpt_client.send_prompt(question)
    raw_answer = result["answer"]
    parsed = json.loads(raw_answer)
    final_answer = parsed["answer"]
    print(final_answer)
    # print(result)

if __name__ == "__main__":
    test_gpt()
