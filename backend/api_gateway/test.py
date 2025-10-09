import requests
import json

# 修改为官方 HTTPS 地址
API_URL = "https://www.jobgen.ai/version-test/api/1.1/wf/jobgen_gpt_access"  # 你的实际 API 地址

# 替换为你的 JWT Token
JWT_TOKEN = "your_actual_jwt_token_here"

def test_gpt_access():
    payload = {
        "question": "Generate one job interview question for a software engineer position."
    }

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {JWT_TOKEN}"
    }

    print(f"Testing API: {API_URL}\n")
    try:
        response = requests.post(API_URL, headers=headers, json=payload, timeout=15)

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


if __name__ == "__main__":
    test_gpt_access()
