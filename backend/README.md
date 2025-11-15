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
| `initdb` | Initialize database schema inside backend container |
| `reset_db` | Drop all tables and recreate them |
| `status` | Show container status |
| `logs` | Follow backend logs |
| `test` | Run all unit tests inside the container |
| `run [path]` | Run a specific Python file inside the container (e.g. `app/tests/test.py`) |
| `help` | Show this help message |


---  


# API Documentation: Backend

## http://localhost:9000/login

**Description:**

The basic user login function will initialize the corresponding new user in the database if the user is a new user. Users must log in to participate in activities to ensure that user data exists in the database.

**Method:** `POST`
**URL:** `http://localhost:9000/login`

**Authorization:** None



### Request Body
```json
{
    "email": "<sample_email>",
    "google_jwt": "<sample_jwt>",
    "apple_jwt": "<sample_jwt>"
}
```

### Example Response
**Status:** `200 OK`

```json
{
    "user_id": "<sample_id>",
    "token": "<hidden_token>"
}
```


---

## http://localhost:9000/interview/start

**Description:**

The API that initiates the interview process creates and saves an interview record, and requests AI to generate interview questions of the specified type. It also records and updates active records.

**Method:** `POST`
**URL:** `http://localhost:9000/interview/start`

### Authorization
**Type:** Bearer
**Token:** `<hidden_token>`



### Request Body
```json
{
        "job_description": "We are looking for a passionate and skilled Python Developer to join our technical team. You will be responsible for designing, developing, testing, and deploying efficient, scalable, and reliable software solutions. If you are familiar with the Python ecosystem, have a deep understanding of backend development, and enjoy collaborating with cross-functional teams, we encourage you to apply.",
        "question_type": "technical"
}
```

### Example Response
**Status:** `200 OK`

```json
{
    "interview_id": "c882e6d8-992a-4e0b-b8dc-d42812d662c0",
    "interview_questions": [
        "What are some best practices you follow when designing scalable backend systems in Python?",
        "Can you explain the differences between synchronous and asynchronous programming in Python and provide examples of when to use each?",
        "Describe a challenging bug you encountered in a Python application and how you went about diagnosing and resolving it."
    ]
}
```


---

## http://localhost:9000/interview/feedback

**Description:**

Evaluate the responses based on the interview questions and answers, and the job description. Return structured feedback and store it in a database. The interview_id must be an interview_id that exists in the database, provided by the previous /interview/start.

**Method:** `POST`
**URL:** `http://localhost:9000/interview/feedback`

### Authorization
**Type:** Bearer
**Token:** `<hidden_token>`



### Request Body
```json
{
    "interview_id": "c882e6d8-992a-4e0b-b8dc-d42812d662c0",
    "interview_type": "Technical",
    "interview_question": "Can you explain the differences between Python 2 and Python 3, and why it is important to use Python 3 for new projects?",
    "interview_answer": "The key differences between Python 2 and Python 3 center on string handling, the print statement, and division.\n    Strings/Encoding:\n        Python 2: Strings are default bytes, leading to messy Unicode errors.\n        Python 3: Strings are Unicode by default (for text), cleanly separated from bytes (for data), which resolves encoding issues.\n    Syntax:\n        Python 2: print is a statement (print \"hello\").\n        Python 3: print() is a function (print(\"hello\")).\n    Division:\n        Python 2: Integer division results in an integer (5 / 2 = 2).\n        Python 3: Division results in a float (5 / 2 = 2.5).\n    Why is Python 3 mandatory for new projects?\n        Because Python 2 reached End-of-Life (EOL) in 2020 and receives no further official security updates. All major libraries and new language features are exclusively developed for Python 3. Using Python 3 ensures project security and future viability."
}
```

### Example Response
**Status:** `200 OK`

```json
{
    "interview_feedback": {
        "clarity_structure_score": 5,
        "clarity_structure_feedback": "The response is well-structured and presents information in a logical order, making it easy to follow.",
        "relevance_score": 5,
        "relevance_feedback": "The answer directly addresses the question regarding differences between Python 2 and 3 and the importance of using Python 3 for new projects.",
        "keyword_alignment_score": 4,
        "keyword_alignment_feedback": "The candidate uses relevant terminology related to Python, though specific skills or experiences could enhance this alignment.",
        "confidence_score": 5,
        "confidence_feedback": "The candidate demonstrates a strong command of the subject matter, speaking clearly and with conviction.",
        "conciseness_score": 4,
        "conciseness_feedback": "While mostly concise, a slight reduction in detail could improve brevity without sacrificing clarity.",
        "overall_summary": "The candidate provides a strong, clear, and relevant answer demonstrating a solid understanding of Python 2 and 3 differences. To improve further, they could incorporate more specific keywords related to their experience with Python, which would enhance keyword alignment.",
        "overall_score": 4.6
    }
}
```


---

## http://localhost:9000/user/detail

**Description:**

Obtain structured user information, primarily for tracking processes, badges, history, etc.

**Method:** `GET`
**URL:** `http://localhost:9000/user/detail`

### Authorization
**Type:** Bearer
**Token:** `<hidden_token>`



### Request Body
```json

```

### Example Response
**Status:** `200 OK`

```json
{
    "user_id": "<sample_id>",
    "user_email": "<sample_email>",
    "xp": 14,
    "total_interviews": 1,
    "total_questions": 1,
    "total_active_days": 1,
    "last_active_day": "2025-11-15",
    "consecutive_active_days": 1,
    "max_consecutive_active_days": 1,
    "interviews": [
        {
            "interview_id": "c882e6d8-992a-4e0b-b8dc-d42812d662c0",
            "interview_time": 1763185147067,
            "is_like": 0,
            "questions": [
                {
                    "question_id": "c882e6d8-992a-4e0b-b8dc-d42812d662c0_1763185174383",
                    "question": "Can you explain the differences between Python 2 and Python 3, and why it is important to use Python 3 for new projects?",
                    "answer": "The key differences between Python 2 and Python 3 center on string handling, the print statement, and division.\n    Strings/Encoding:\n        Python 2: Strings are default bytes, leading to messy Unicode errors.\n        Python 3: Strings are Unicode by default (for text), cleanly separated from bytes (for data), which resolves encoding issues.\n    Syntax:\n        Python 2: print is a statement (print \"hello\").\n        Python 3: print() is a function (print(\"hello\")).\n    Division:\n        Python 2: Integer division results in an integer (5 / 2 = 2).\n        Python 3: Division results in a float (5 / 2 = 2.5).\n    Why is Python 3 mandatory for new projects?\n        Because Python 2 reached End-of-Life (EOL) in 2020 and receives no further official security updates. All major libraries and new language features are exclusively developed for Python 3. Using Python 3 ensures project security and future viability.",
                    "feedback": {
                        "clarity_structure_score": 5,
                        "clarity_structure_feedback": "The response is well-structured and presents information in a logical order, making it easy to follow.",
                        "relevance_score": 5,
                        "relevance_feedback": "The answer directly addresses the question regarding differences between Python 2 and 3 and the importance of using Python 3 for new projects.",
                        "keyword_alignment_score": 4,
                        "keyword_alignment_feedback": "The candidate uses relevant terminology related to Python, though specific skills or experiences could enhance this alignment.",
                        "confidence_score": 5,
                        "confidence_feedback": "The candidate demonstrates a strong command of the subject matter, speaking clearly and with conviction.",
                        "conciseness_score": 4,
                        "conciseness_feedback": "While mostly concise, a slight reduction in detail could improve brevity without sacrificing clarity.",
                        "overall_summary": "The candidate provides a strong, clear, and relevant answer demonstrating a solid understanding of Python 2 and 3 differences. To improve further, they could incorporate more specific keywords related to their experience with Python, which would enhance keyword alignment.",
                        "overall_score": 4.6
                    },
                    "timestamp": 1763185174383
                }
            ]
        }
    ],
    "badges": [
        {
            "badge_id": 2,
            "unlock_date": 1763185174430
        },
        {
            "badge_id": 7,
            "unlock_date": 1763185174471
        }
    ]
}
```


---

## http://localhost:9000/user/like

**Description:**

Modify the `is_like` field of the interview corresponding to `interview_id` to indicate whether the interview was liked by the user. Each call to this API will invert the `is_like` field. The `interview_id` must be an `interview_id` that exists in the database.

**Method:** `POST`
**URL:** `http://localhost:9000/user/like`

### Authorization
**Type:** Bearer
**Token:** `<hidden_token>`



### Request Body
```json
{
    "interview_id": "c882e6d8-992a-4e0b-b8dc-d42812d662c0"
}
```

### Example Response
**Status:** `200 OK`

```json
{
    "is_like": true
}
```


---

## http://localhost:9000/user/interview_summary

**Description:**

Obtain overall statistical information on user interviews, including average scores across various dimensions.

**Method:** `GET`
**URL:** `http://localhost:9000/user/interview_summary`

### Authorization
**Type:** Bearer
**Token:** `<hidden_token>`



### Request Body
```json

```

### Example Response
**Status:** `200 OK`

```json
{
    "avg_clarity": 5,
    "avg_relevance": 5,
    "avg_keyword": 4,
    "avg_confidence": 5,
    "avg_conciseness": 4,
    "avg_overall": 4.6
}
```


---
