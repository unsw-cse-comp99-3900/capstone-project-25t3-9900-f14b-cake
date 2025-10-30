

CREATE_TABLE_INTERVIEW_SCORE = """
CREATE TABLE IF NOT EXISTS interview_score (
    user_id INTEGER NOT NULL,
    session_id INTEGER NOT NULL,
    score NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (score >= 0),
    PRIMARY KEY (user_id, session_id)
);
"""

# tonia, 1, badge 1
# yifeng, 1, badge 1
# Tonia, 2, badge 2


#                Badge 1 (tick)             badge 2  (tick)              badge 3          badge 4            

