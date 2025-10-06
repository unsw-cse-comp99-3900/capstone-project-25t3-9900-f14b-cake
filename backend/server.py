from flask import Flask, request, render_template
from flask_cors import CORS
import config
import os
from json import dumps
from auth import login, logout
from home import get_home_dashboard
from interview import interview_start, interview_text_answer, interview_feedback

def defaultHandler(err):
    response = err.get_response()
    print('response', err, err.get_response())
    response.data = dumps({
        "code": err.code,
        "name": "System Error",
        "message": err.get_description(),
    })
    response.content_type = 'application/json'
    return response

APP = Flask(__name__)
CORS(APP)

APP.config['TRAP_HTTP_EXCEPTIONS'] = True
APP.register_error_handler(Exception, defaultHandler)

dummy_token = 0

@APP.route("/home", methods=['GET'])
def server_home():
    """ get the home dashboard
    Args:
        token: string
    
    Returns:
        interviews: [
            {
                interview_id: int,
                type: string,
                question: string,
                answer: string,
                feedback: string,
                score: [int],
                date: int (unix timestamp)
            }
        ]
    """
    
    token = str(request.args.get("token"))
    ret = get_home_dashboard(token)
    return {
        'home_interview': ret["home_interview"],
    }

@APP.route("/login", methods=['POST'])
def server_auth_login():
    """ existing user login
    Args:
        email: string
        password: string

    Returns:
        user_id: int
        token: string
    """
    
    data = request.get_json()
    ret = login(data['email'], data['password'])
    return {
        'user_id': ret['user_id'],
        'token': ret['token']
    }

@APP.route("/logout", methods=['POST'])
def server_auth_logout():
    """ logged in user logout
    Args:
        token: string

    Returns:
        None
    """
    
    data = request.get_json()
    ret = logout(data['token'])
    return {}

@APP.route("/interview/start", methods=['POST'])
def server_interview_start():
    """generate interview questions for user
    Args:
        token: string

    Returns:
        interview_questions: [
            {
                interview_id: int,
                type: string,
                question: string,
            }
        ]
    """
    
    data = request.get_json()
    ret = interview_start(data['token'])
    return {
        'interview_questions': ret["interview_questions"],
    }

@APP.route("/interview/answer", methods=['POST'])
def server_interview_answer():
    """answer interview question
    Args:
        token: string

    Returns:
        interview_answer: string
    """
    data = request.get_json()
    ret = interview_text_answer(data['token'])
    return {
        'interview_answer': ret["interview_answer"],
    }

@APP.route("/interview/feedback", methods=['POST'])
def server_interview_answer():
    """generate interview questions for user
    Args:
        token: string
        interview_question: string
        interview_answer: string

    Returns:
        interview_feedback: string
    """
    data = request.get_json()
    ret = interview_feedback(data['token'], data['interview_question'], data['interview_answer'])
    return {
        'interview_feedback': ret["interview_feedback"],
        'interview_score': ret["interview_score"]
    }

if __name__ == "__main__":
    APP.run(debug=True, port=config.port)