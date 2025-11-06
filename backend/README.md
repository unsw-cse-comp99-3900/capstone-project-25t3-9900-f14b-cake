#  manage_docker.py Usage Guide

###  File
`backend/manage_docker.py`

---

##  Usage

```bash
./manage_docker.py [command] [args]
```

###  Available Commands

| Command | Description |
|----------|-------------|
| `start` | Start backend + database containers |
| `stop` | Stop all containers |
| `reset` | Remove containers and volumes, rebuild everything |
| `status` | Show container status |
| `logs` | Follow backend logs |
| `test` | Run all unit tests inside the container |
| `run [path]` | Run a specific Python file inside the container (e.g. `app/tests/test.py`) |
| `help` | Show this help message |

---

##  Backend API Endpoints

---

### 🔹 `/auth/login`

**URL:**  
`http://localhost:8000/auth/login`

**Expected JSON (Body):**
```json
{
    "email": "sample@sample.com",
    "google_jwt": "xwz",
    "apple_jwt": "xwz"
}
```

**Expected Response (Body):**
```json
{
    "status": "ok",
    "user_id": "sample@sample.com",
    "token": "xxxx.xxxx.xxxx"
}
```

---

### 🔹 `/interview/start`

**URL:**  
`http://localhost:8000/interview/start`

**Expected JSON (Body):**
```json
{
    "token": "xxxx.xxxx.xxxx",
    "job_description": "We are looking for a passionate and skilled Python Developer to join our technical team. You will be responsible for designing, developing, testing, and deploying efficient, scalable, and reliable software solutions. If you are familiar with the Python ecosystem, have a deep understanding of backend development, and enjoy collaborating with cross-functional teams, we encourage you to apply.",
    "question_type": "technical"
}
```

**Expected Response (Body):**
```json
{
    "status": "ok",
    "interview_id": "xxxxxxx",
    "interview_questions": [
        "What are some best practices you follow when designing RESTful APIs in Python, and how do you ensure they are scalable and reliable?",
        "Can you explain the differences between synchronous and asynchronous programming in Python, and provide examples of when you would use each approach?",
        "Describe your experience with testing frameworks in Python. How do you approach writing unit tests and integration tests for your applications?"
    ]
}
```

---

### 🔹 `/interview/feedback`

**URL:**  
`http://localhost:8000/interview/feedback`

> 💡 *In the answer section, please use a string that conforms to JSON format.*

**Expected JSON (Body):**
```json
{
    "token": "xxxx.xxxx.xxxx",
    "interview_question": "Can you explain the differences between Python 2 and Python 3, and why it is important to use Python 3 for new projects?",
    "interview_answer": "The key differences between Python 2 and Python 3 center on string handling, the print statement, and division.
    Strings/Encoding:
        Python 2: Strings are default bytes, leading to messy Unicode errors.
        Python 3: Strings are Unicode by default (for text), cleanly separated from bytes (for data), which resolves encoding issues.
    Syntax:
        Python 2: print is a statement (print \"hello\").
        Python 3: print() is a function (print(\"hello\")).
    Division:
        Python 2: Integer division results in an integer (5 / 2 = 2).
        Python 3: Division results in a float (5 / 2 = 2.5).
    Why is Python 3 mandatory for new projects?
        Because Python 2 reached End-of-Life (EOL) in 2020 and receives no further official security updates. All major libraries and new language features are exclusively developed for Python 3. Using Python 3 ensures project security and future viability."
}
```

**Expected Response (Body):**
```json
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
```

---

 **Notes**
- All JSON examples use **double quotes** for compatibility.
- Use **Postman** or **curl** to test endpoints.
- Tokens are JWTs generated after authentication.
