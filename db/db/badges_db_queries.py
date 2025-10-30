
CREATE_TABLE_USER_DETAIL = """
CREATE TABLE IF NOT EXISTS user_badge (
    user_id SERIAL PRIMARY KEY,
    user_name VARCHAR(255) UNIQUE NOT NULL,
    badge_progress JSONB DEFAULT '[0,0,0,0,0]',
    max_score INTEGER DEFAULT 0,
    xp INTEGER DEFAULT 0
);
"""

UPDATE_BADGE_BY_ID = """

"""

GET_BADGE_STATUS_FROM_USRS = """
SELECT * from user_badge
WHERE user_name = %s;
"""

GET_MAX_SCORE_BY_USER = """
SELECT max_score from user_badge
WHERE user_name = %s;
"""