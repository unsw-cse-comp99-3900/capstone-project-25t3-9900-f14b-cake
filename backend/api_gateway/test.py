import requests
import os
from dotenv import load_dotenv
import json
from gpt_access import GPTAccessClient
from pprint import pprint

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))

API_URL = os.getenv("GPT_ACCESS_URL")
# API_URL = "https://jobgen.ai/version-test/api/1.1/wf/jobgen_gpt_access"  

# JWT Token
JWT_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjE3NjAwMDAzNTc4MzJ4ODkzODA2MjMzMDAzNDg1MDAwIiwiZW1haWwiOiJseWY0Nzc0NDkyMkBnbWFpbC5jb20iLCJpYXQiOjE3NjAwNTQ0ODcsIm5iZiI6MTc2MDA1NDQ4NywiZXhwIjoxNzYyNjQ2NDg3fQ.Bq9XVg2p_bmexvn9vtLpUKeeN3hVijjKiHiLxicCQfU"

def test_gpt_access():
    payload = {
        "question": "Generate one job interview question for a software engineer position."
    }

    headers = {
        "Authorization": f"Bearer {JWT_TOKEN}",
        "Content-Type": "application/json"
    }

    params = {
        "Key": "question",
        "Type": "text",
        "Required": True
    } 

    print(f"Testing API: {API_URL}\n")
    try:
        response = requests.post(API_URL, headers=headers, params=params, json=payload, timeout=15)

        print(f"Status code: {response.status_code}")
        if response.status_code == 200:
            try:
                data = response.json()
                print("Response JSON:")
                print(json.dumps(data, indent=2, ensure_ascii=False))
            except json.JSONDecodeError:
                print("Response is not valid JSON:")
                print(response.text)
        else:
            print("Unexpected response:")
            print(response.text)

    except requests.exceptions.RequestException as e:
        print("Request failed:")
        print(e)


def test_gpt():
    question = "Generate one job interview question for a software engineer position."
    gpt_client = GPTAccessClient(JWT_TOKEN)
    result = gpt_client.send_prompt(question)
    raw_answer = result["answer"]
    parsed = json.loads(raw_answer)
    final_answer = parsed["answer"]
    print(final_answer)


if __name__ == "__main__":
    # test_gpt_access()
    # print(API_URL)
    test_gpt()
