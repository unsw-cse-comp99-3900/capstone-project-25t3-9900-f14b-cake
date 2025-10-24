CREATE_TABLE_USER_DETAIL = """
CREATE TABLE IF NOT EXISTS user_detail (
    user_id SERIAL PRIMARY KEY,
    user_name VARCHAR(255) UNIQUE NOT NULL,
    interviews JSONB DEFAULT '[]',       
    fav_interviews JSONB DEFAULT '[]',
    readiness_score INTEGER DEFAULT 0,
    login_streak INTEGER DEFAULT 0,
    xp INTEGER DEFAULT 0,
    badges JSONB DEFAULT '[]'            
);
"""

CREATE_TABLE_INTERVIEW_DETAIL = """
CREATE TABLE IF NOT EXISTS interviews (
    interview_id SERIAL PRIMARY KEY,    
    questions JSONB DEFAULT '[]',                                              
    date TIMESTAMP DEFAULT NOW()
);
"""

CREATE_TABLE_QUESTION_DETAIL = """
CREATE TABLE IF NOT EXISTS questions (
    question_id SERIAL PRIMARY KEY,
    type VARCHAR(100) NOT NULL,
    answer TEXT,
    feedback JSONB DEFAULT '{}'::jsonb
);
"""


CREATE_TABLE_USER_INTERVIEW = """
CREATE TABLE IF NOT EXISTS user_interview (  
    user_id INTEGER NOT NULL REFERENCES user_detail(user_id) ON DELETE CASCADE,
    interview_id INTEGER NOT NULL REFERENCES interviews(interview_id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, interview_id)
);
"""

CREATE_TABLE_INTERVIEW_QUESTION = """
CREATE TABLE IF NOT EXISTS interview_question (
    interview_id INTEGER NOT NULL REFERENCES interviews(interview_id) ON DELETE CASCADE,
    question_id INTEGER NOT NULL REFERENCES questions(question_id) ON DELETE CASCADE,
    sequence INTEGER DEFAULT 0,
    PRIMARY KEY (interview_id, question_id)
);
"""



# CREATE_TABLE_BADGE_DETAIL = """
# CREATE TABLE IF NOT EXISTS badges (
#     badge_id SERIAL PRIMARY KEY,             
#     type INTEGER NOT NULL,                   
#     description TEXT NOT NULL,               
#     unlock_date TIMESTAMP DEFAULT NOW(),     
# );
# """

# CREATE_TABLE_USER_BADGE = """
# CREATE TABLE IF NOT EXISTS user_badge (
#     user_id INTEGER REFERENCES user_detail(user_id) ON DELETE CASCADE,
#     badge_id INTEGER REFERENCES badges(badge_id) ON DELETE CASCADE,
#     unlock_date TIMESTAMP DEFAULT NOW(),
#     PRIMARY KEY (user_id, badge_id)
# );
# """