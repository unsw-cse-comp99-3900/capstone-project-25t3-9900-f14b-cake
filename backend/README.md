backend/manage_docker.py
Usage: ./manage_docker.py [command] [args]

Available commands:
  start               Start backend + database containers
  stop                Stop all containers
  reset               Remove containers and volumes, rebuild everything
  status              Show container status
  logs                Follow backend logs
  test                Run all unit tests inside the container
  run [path]          Run a specific Python file inside the container (e.g. app/tests/test.py)
  help                Show this help message

API of backend: 

##http://localhost:8000/auth/login
Expected JSON (Body):
{
    "email": "lyf47744922@gmail.com",
    "google_jwt": "xwz",
    "apple_jwt": "xwz"
}

Expected response (Body):
{
    "status": "ok",
    "user_id": "lyf47744922@gmail.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjE3NjAwMDAzNTc4MzJ4ODkzODA2MjMzMDAzNDg1MDAwIiwiZW1haWwiOiJseWY0Nzc0NDkyMkBnbWFpbC5jb20iLCJpYXQiOjE3NjIwODE3OTgsIm5iZiI6MTc2MjA4MTc5OCwiZXhwIjoxNzYyMTY4MTk4fQ.xuwn-MlkqlNKEDXD1LjtTAsAg7FPIM8FFAd_tTp15uY"
}

##http://localhost:8000/interview/start
Expected JSON (Body):
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjE3NjAwMDAzNTc4MzJ4ODkzODA2MjMzMDAzNDg1MDAwIiwiZW1haWwiOiJseWY0Nzc0NDkyMkBnbWFpbC5jb20iLCJpYXQiOjE3NjAwNTQ0ODcsIm5iZiI6MTc2MDA1NDQ4NywiZXhwIjoxNzYyNjQ2NDg3fQ.Bq9XVg2p_bmexvn9vtLpUKeeN3hVijjKiHiLxicCQfU",
    "job_description": "We are looking for a passionate and skilled Python Developer to join our technical team. You will be responsible for designing, developing, testing, and deploying efficient, scalable, and reliable software solutions. If you are familiar with the Python ecosystem, have a deep understanding of backend development, and enjoy collaborating with cross-functional teams, we encourage you to apply.",
    "question_type": "technical"
}
Expected response (Body):
{
    "status": "ok",
    "interview_questions": [
        "What are some best practices you follow when designing RESTful APIs in Python, and how do you ensure they are scalable and reliable?",
        "Can you explain the differences between synchronous and asynchronous programming in Python, and provide examples of when you would use each approach?",
        "Describe your experience with testing frameworks in Python. How do you approach writing unit tests and integration tests for your applications?"
    ]
}


##http://localhost:8000/interview/feedback
In the answer section, please use a string that conforms to JSON format.
Expected JSON (Body):
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjE3NjAwMDAzNTc4MzJ4ODkzODA2MjMzMDAzNDg1MDAwIiwiZW1haWwiOiJseWY0Nzc0NDkyMkBnbWFpbC5jb20iLCJpYXQiOjE3NjAwNTQ0ODcsIm5iZiI6MTc2MDA1NDQ4NywiZXhwIjoxNzYyNjQ2NDg3fQ.Bq9XVg2p_bmexvn9vtLpUKeeN3hVijjKiHiLxicCQfU",
    "interview_question": "Can you explain the differences between Python 2 and Python 3, and why it is important to use Python 3 for new projects?",
    "interview_answer": "The key differences between Python 2 and Python 3 center on string handling, the print statement, and division.\n    Strings/Encoding:\n        Python 2: Strings are default bytes, leading to messy Unicode errors.\n        Python 3: Strings are Unicode by default (for text), cleanly separated from bytes (for data), which resolves encoding issues.\n    Syntax:\n        Python 2: print is a statement (print \"hello\").\n        Python 3: print() is a function (print(\"hello\")).\n    Division:\n        Python 2: Integer division results in an integer (5 / 2 = 2).\n        Python 3: Division results in a float (5 / 2 = 2.5).\n    Why is Python 3 mandatory for new projects?\n        Because Python 2 reached End-of-Life (EOL) in 2020 and receives no further official security updates. All major libraries and new language features are exclusively developed for Python 3. Using Python 3 ensures project security and future viability."
}
Expected response (Body):
{
    "status": "ok",
    "interview_feedback": {
        "clarity_structure_score": 5,
        "clarity_structure_feedback": "The response is well-organized, with clear sections addressing each aspect of the question.",
        "relevance_score": 5,
        "relevance_feedback": "The answer directly addresses the differences between Python 2 and 3 and emphasizes the importance of using Python 3, which is highly relevant.",
        "keyword_alignment_score": 4,
        "keyword_alignment_feedback": "The candidate used relevant technical terms, but could further enhance alignment by mentioning specific libraries or frameworks commonly used in Python 3.",
        "confidence_score": 4,
        "confidence_feedback": "The tone is confident and knowledgeable, though a bit more enthusiasm could enhance the delivery.",
        "conciseness_score": 4,
        "conciseness_feedback": "The answer is mostly concise, but could be slightly tightened by reducing redundancy in explanations.",
        "overall_summary": "Overall, the candidate demonstrated a strong understanding of the differences between Python 2 and 3, effectively communicating their importance for new projects. To improve, the candidate could incorporate more specific examples of libraries and maintain a more dynamic tone throughout.",
        "overall_score": 4.4
    }
}