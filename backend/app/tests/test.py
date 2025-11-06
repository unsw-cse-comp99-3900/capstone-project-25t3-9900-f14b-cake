import json
from textwrap import dedent
from app.external_access import GPTAccessClient, FAQAccessClient, VerifyAccessClient
from typing import List, Optional, Any, Dict
# from prompt_builder import build_question_prompt, build_feedback_prompt, build_multicrit_feedback_prompt, build_answer_prompt
from app.prompt_builder import build_question_prompt, build_feedback_prompt, build_multicrit_feedback_prompt, build_answer_prompt
from app.services.auth_service import login, get_user_id_and_email
from app.services.interview_service import interview_start, interview_feedback
from app.services.user_service import get_user_detail, get_user_interview_summary
# JWT Token
JWT_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjE3NjAwMDAzNTc4MzJ4ODkzODA2MjMzMDAzNDg1MDAwIiwiZW1haWwiOiJseWY0Nzc0NDkyMkBnbWFpbC5jb20iLCJpYXQiOjE3NjAwNTQ0ODcsIm5iZiI6MTc2MDA1NDQ4NywiZXhwIjoxNzYyNjQ2NDg3fQ.Bq9XVg2p_bmexvn9vtLpUKeeN3hVijjKiHiLxicCQfU"

question = "Can you explain the differences between Python 2 and Python 3, and why it is important to use Python 3 for new projects?"
answer = '''
    The key differences between Python 2 and Python 3 center on string handling, the print statement, and division.
    Strings/Encoding:
        Python 2: Strings are default bytes, leading to messy Unicode errors.
        Python 3: Strings are Unicode by default (for text), cleanly separated from bytes (for data), which resolves encoding issues.
    Syntax:
        Python 2: print is a statement (print "hello").
        Python 3: print() is a function (print("hello")).
    Division:
        Python 2: Integer division results in an integer (5 / 2 = 2).
        Python 3: Division results in a float (5 / 2 = 2.5).
    Why is Python 3 mandatory for new projects?
        Because Python 2 reached End-of-Life (EOL) in 2020 and receives no further official security updates. All major libraries and new language features are exclusively developed for Python 3. Using Python 3 ensures project security and future viability.
'''.strip()

def print_format_answer():
    print(json.dumps({"answer": answer}, indent=2))

def test_prompt():
    job_description = "We are looking for a passionate and skilled Python Developer to join our technical team. You will be responsible for designing, developing, testing, and deploying efficient, scalable, and reliable software solutions. If you are familiar with the Python ecosystem, have a deep understanding of backend development, and enjoy collaborating with cross-functional teams, we encourage you to apply."
    question_type = "Technical"
    ask_GPT_question = build_question_prompt(job_description, question_type, 3)
    print(ask_GPT_question)


def test_gpt():
    job_description = "We are looking for a passionate and skilled Python Developer to join our technical team. You will be responsible for designing, developing, testing, and deploying efficient, scalable, and reliable software solutions. If you are familiar with the Python ecosystem, have a deep understanding of backend development, and enjoy collaborating with cross-functional teams, we encourage you to apply."
    question_type = "Technical"
    gpt_client = GPTAccessClient(JWT_TOKEN)

    ask_GPT_question = build_question_prompt(job_description, question_type)
    # print(ask_GPT_question)
    result = gpt_client.send_prompt(ask_GPT_question)
    raw_answer = result["answer"]
    parsed = json.loads(raw_answer)
    final_answer = parsed["answer"]
    questions = str(final_answer).split("@")
    print(questions)
    
    # ask_GPT_question = build_feedback_prompt(question=question, answer=answer, job_description=job_description)
    # # print(ask_GPT_question)
    # result = gpt_client.send_prompt(ask_GPT_question)
    # raw_answer = result["answer"]
    # parsed = json.loads(raw_answer)
    # for k, v in parsed.items():
    #     print(k + ":", v)
    # """
    # clarity_structure_score: 5
    # clarity_structure_feedback: The response is well-organized and presents information in a logical flow, making it easy to follow.
    # relevance_score: 5
    # relevance_feedback: The answer directly addresses the question and aligns well with the requirements of the Python Developer role.
    # keyword_alignment_score: 5
    # keyword_alignment_feedback: The candidate effectively uses relevant terminology and concepts related to Python development.
    # confidence_score: 4
    # confidence_feedback: The candidate displays a solid understanding of the topic, though a slightly more assertive tone could enhance the overall confidence.
    # conciseness_score: 4
    # conciseness_feedback: The answer is mostly concise, but could be trimmed slightly to improve brevity without losing essential information.
    # overall_summary: Overall, the candidate demonstrates a strong grasp of the differences between Python 2 and 3, highlighting significant points that are relevant to the role. To improve, they could work on conveying their responses with more assertiveness and focus on brevity while maintaining clarity.
    # """

    # ask_GPT_question = build_answer_prompt(question=question, answer=answer, job_description=job_description)
    # result = gpt_client.send_prompt(ask_GPT_question)
    # raw_answer = result["answer"]
    # parsed = json.loads(raw_answer)
    # final_answer = parsed["answer"]
    # print(final_answer)  # final_answer return a string (it may need to use str() function).

    # ask_GPT_question = build_multicrit_score_prompt(question=question, answer=answer, job_description=job_description)
    # result = gpt_client.send_prompt(ask_GPT_question)
    # # print(result)
    # load_answer = result["answer"]
    # # print(load_answer)
    # # print(type(load_answer))
    # scores = json.loads(load_answer) 
    # print(type(scores)) # <class 'list'>
    # print(scores) # [5, 5, 5, 5, 5]

    # ask_GPT_question = build_multicrit_feedback_prompt(question=question, answer=answer, job_description=job_description)
    # # print(ask_GPT_question)
    # result = gpt_client.send_prompt(ask_GPT_question)
    # raw_answer = result["answer"]
    # parsed = json.loads(raw_answer)
    # print(parsed) # {'clarity_structure_score': 5, 'clarity_structure_feedback': "The candidate's response is extremely clear and follows a logical flow, effectively outlining the differences between Python 2 and Python 3.", 'relevance_score': 5, 'relevance_feedback': 'The answer is fully relevant, directly addressing the question and tying back to the importance of using Python 3 for new projects, which aligns well with the job description.', 'keyword_alignment_score': 4, 'keyword_alignment_feedback': 'The candidate uses relevant keywords related to Python development, though there could be more specific terms related to backend development.', 'confidence_score': 4, 'confidence_feedback': 'The delivery is generally confident with minor pauses, suggesting familiarity with the topic.', 'conciseness_score': 4, 'conciseness_feedback': 'The response is mostly focused and succinct, though it could be slightly more concise in some areas.', 'overall_summary': 'Overall, the candidate demonstrates a strong understanding of the differences between Python versions and articulates the importance of Python 3 effectively. To improve, they could enhance their use of specific backend-related keywords and aim for greater conciseness in their explanations.'}


def test_faq():
    client = FAQAccessClient(JWT_TOKEN)
    result = client.get_profile()
    # print(result)
    response = result["response"]
    # parsed = json.loads(response)
    # print(response)
    # for key in response:
    #     print(str(key) + ":")
    #     print(response[key])
    #     print()
    # print(response.keys())
    skills = response.get("skills") # a list, for each object in the list, they have those key: (name, years_of_experience)
    education = response.get("education") # a list, for each object in the list, they have those key: (order, degree, institute, gpa, ongoing, description, education_mode, location, start_date, end_date)
    experience = response.get("experience")  # a list, for each object in the list, they have those key: (company_name, location, title, employment_type, role_description, start_date, end_date, ongoing)
    print("skills:")
    print(skills)
    print("education:")
    print(education)
    print("experience:")
    print(experience)
    '''
    skills:
    [ { "name": "Programming Languages", "years_of_experience": "2" },  { "name": "Version Control", "years_of_experience": "4" },  { "name": "Software Development Life Cycle (SDLC)", "years_of_experience": "1" },  { "name": "Problem Solving", "years_of_experience": "1" },  { "name": "Debugging", "years_of_experience": "2" },  { "name": "Database Management", "years_of_experience": "1" },  { "name": "Cloud Computing", "years_of_experience": "2" },  { "name": "Agile Methodologies", "years_of_experience": "2" }]
    education:
    [{    "order": "1",  "degree": "Capstone Project",    "institute": "UNSW Sydney",    "gpa": "",    "ongoing": "no",    "description": "",    "education_mode": "Full-time",    "location": "",    "start_date": "12/02/2024",    "end_date": "11/09/16 " }]
    experience:
    []
    '''

def test_auth():
    email = "lyf47744922@gmail.com"
    google_jwt = "xyz"
    apple_jwt = None
    # client = VerifyAccessClient(email, google_jwt, apple_jwt)
    # result = client.token_verify()
    result = login(email, google_jwt, apple_jwt)
    jwt = result["token"]
    user_info = get_user_id_and_email(jwt)
    print("user_info:\n", user_info)
    print()


def test_interview():
    token = JWT_TOKEN
    job_description = "We are looking for a passionate and skilled Python Developer to join our technical team. You will be responsible for designing, developing, testing, and deploying efficient, scalable, and reliable software solutions. If you are familiar with the Python ecosystem, have a deep understanding of backend development, and enjoy collaborating with cross-functional teams, we encourage you to apply."
    question_type = "Technical"
    interview = interview_start(token, job_description, question_type)
    # print(interview)
    # interview_id = "2b283ef0-4b93-4913-8efd-bd6bbf5e5917"
    interview_id = interview["interview_id"]
    feedback = interview_feedback(token, interview_id, question_type, question, answer)
    print("feedback:\n", feedback)
    print()

def test_user():
    result = get_user_detail(JWT_TOKEN)
    print("user_detail:\n", result)
    print()
    result = get_user_interview_summary(JWT_TOKEN)
    print("interview_summary:\n", result)

if __name__ == "__main__":
    # print_format_answer()
    # test_prompt()
    # test_gpt()
    # test_faq()
    test_auth()
    test_interview()
    test_user()

