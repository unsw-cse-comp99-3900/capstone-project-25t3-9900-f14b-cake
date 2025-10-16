import json
from api_gateway import GPTAccessClient, FAQAccessClient
from typing import List, Optional, Any, Dict
from prompt_builder import (
    build_question_prompt, 
    build_feedback_prompt, 
    build_multicrit_feedback_prompt, 
    build_score_prompt, 
    build_multicrit_score_prompt, 
    build_answer_prompt
    )


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
'''



def test_gpt():
    job_description = "We are looking for a passionate and skilled Python Developer to join our technical team. You will be responsible for designing, developing, testing, and deploying efficient, scalable, and reliable software solutions. If you are familiar with the Python ecosystem, have a deep understanding of backend development, and enjoy collaborating with cross-functional teams, we encourage you to apply."
    question_type = "Technical"
    gpt_client = GPTAccessClient(JWT_TOKEN)

    # ask_GPT_question = build_question_prompt(job_description, question_type)
    # print(ask_GPT_question)
    # result = gpt_client.send_prompt(ask_GPT_question)
    # raw_answer = result["answer"]
    # parsed = json.loads(raw_answer)
    # final_answer = parsed["answer"]
    # questions = str(final_answer).split("@")
    # print(questions)
    
    # ask_GPT_question = build_feedback_prompt(question=question, answer=answer, job_description=job_description)
    # print(ask_GPT_question)
    # result = gpt_client.send_prompt(ask_GPT_question)
    # raw_answer = result["answer"]
    # parsed = json.loads(raw_answer)
    # final_answer = parsed["answer"]
    # print(final_answer)
    # print("Summary:\n", final_answer["Summary"])  # final_answer["Summary"] is a string (it may need to use str() function).
    # print("Analysis:\n", final_answer["Analysis"]) # final_answer["Analysis"] with keys as (clarity, logic, technical depth, communication, and role fit) (May need to be processed like json or dict).
    # print("Suggestions:\n", final_answer["Suggestions"]) # final_answer["Suggestions"] is a list of suggestions.

    # ask_GPT_question = build_score_prompt(question=question, answer=answer, job_description=job_description)
    # result = gpt_client.send_prompt(ask_GPT_question)
    # raw_answer = result["answer"]
    # parsed = json.loads(raw_answer) 
    # final_answer = parsed["answer"]
    # print(final_answer)  # here is a int between 1 to 100.

    # ask_GPT_question = build_answer_prompt(question=question, answer=answer, job_description=job_description)
    # result = gpt_client.send_prompt(ask_GPT_question)
    # raw_answer = result["answer"]
    # parsed = json.loads(raw_answer)
    # final_answer = parsed["answer"]
    # print(final_answer)  # final_answer return a string (it may need to use str() function).

    # ask_GPT_question = build_multicrit_score_prompt(question=question, answer=answer, job_description=job_description)
    # result = gpt_client.send_prompt(ask_GPT_question)
    # # print(result)
    # raw_answer = result["answer"]
    # # print(raw_answer)
    # # print(type(raw_answer))
    # parsed = json.loads(raw_answer) 
    # print(parsed) # here is list of int

    ask_GPT_question = build_multicrit_feedback_prompt(question=question, answer=answer, job_description=job_description)
    # print(ask_GPT_question)
    result = gpt_client.send_prompt(ask_GPT_question)
    raw_answer = result["answer"]
    parsed = json.loads(raw_answer)
    print(parsed)




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








def _coerce_five_scores_1_to_5(seq: List[Any]) -> Optional[List[int]]:
    """
    Validate: must be exactly 5 integers, each in [1,5].
    Coerce numeric-like strings; clamp out-of-range just in case.
    """
    if not isinstance(seq, list) or len(seq) != 5:
        return None
    out: List[int] = []
    for x in seq:
        try:
            n = int(x)
        except Exception:
            return None
        # clamp defensively
        if n < 1: n = 1
        if n > 5: n = 5
        out.append(n)
    return out

def _try_parse_scores_array(raw: str) -> Optional[List[int]]:
    """
    First try strict JSON parsing. If that fails, fallback to regex extracting 5 numbers 1-5.
    """
    # 1) strict JSON
    try:
        parsed = json.loads(raw)
        coerced = _coerce_five_scores_1_to_5(parsed)
        if coerced:
            return coerced
    except Exception:
        pass

    # 2) fallback: pull five 1–5 integers from text in order
    nums = [int(n) for n in re.findall(r"\b([1-5])\b", raw)]
    if len(nums) >= 5:
        return _coerce_five_scores_1_to_5(nums[:5])

    return None

def interview_feedback(token: str, interview_question: str, interview_answer: str) -> Dict[str, Any]:
    """
    Generate textual feedback and a 5-element list of 1-5 scores in this order:
    [Clarity & Structure, Relevance, Keyword Alignment, Confidence, Conciseness]
    """
    # Fetch user's profile from FAQ_ACCESS to enrich feedback
    user_info: Dict[str, Any] = {}
    try:
        faq_client = FAQAccessClient(token)
        faq_result = faq_client.get_profile()
        user_info = (faq_result or {}).get("response", {}) or {}
    except Exception:
        user_info = {}

    # Build feedback prompt (unchanged)
    feedback_prompt = build_feedback_prompt(
        question=interview_question,
        answer=interview_answer,
        user_info=user_info
    )

    gpt = GPTAccessClient(token)
    feedback_result = gpt.send_prompt(feedback_prompt)
    feedback_raw_api = (feedback_result or {}).get("answer", "").strip()
    feedback_text = _unwrap_api_answer(feedback_raw_api)

    # Build multi-criteria score prompt (NEW)
    # If you have JD available at call-site, pass it here; otherwise omit.
    score_prompt = build_multicrit_score_prompt(
        question=interview_question,
        answer=interview_answer,
        # job_description=optional_jd
    )
    score_result = gpt.send_prompt(score_prompt)
    score_raw_api = (score_result or {}).get("answer", "").strip()
    score_text = _unwrap_api_answer(score_raw_api)

    scores = _try_parse_scores_array(score_text)

    # Final safety: if parsing failed for any reason, provide a neutral default
    if not scores:
        scores = [3, 3, 3, 3, 3]

    # Return shape matches FastAPI model: List[int]
    return {
        "interview_feedback": feedback_text,
        "interview_score": scores,
    }

if __name__ == "__main__":
    test_gpt()
    # test_faq()
