import requests
import os
from dotenv import load_dotenv
import json
# from gpt_access import GPTAccessClient
from pprint import pprint

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))

API_URL = os.getenv("GPT_ACCESS_URL")

# JWT Token
JWT_TOKEN = os.getenv("TEST_JWT")

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

def test_faq():
    API_URL = os.getenv("FAQ_ACCESS_URL")
    headers = {"Authorization": f"Bearer {JWT_TOKEN}", "Content-Type": "application/json"}
    resp = requests.post(API_URL, headers=headers, json={})
    if resp.ok:
        result = resp.json()["response"]
        print(result)

def test_token_verify():
    API_URL = os.getenv("Token_Verify_URL")
    headers = {
        "Content-Type": "application/json", 
        }

    payload = {
        "email": "lyf47744922@gmail.com",
        "google_jwt": "xwz",
        "apple_jwt": "xwz"
    }

    resp = requests.post(API_URL, headers=headers, json=payload)
    if resp.ok:
        result = resp.json()["response"]
        print(result)
    else:
        print(resp)


if __name__ == "__main__":
    test_gpt_access()
    # print(API_URL)
    # test_gpt()
    # test_faq()
    test_token_verify()
