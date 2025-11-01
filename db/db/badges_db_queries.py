CREATE_TABLE_USER_DETAIL = """
CREATE TABLE IF NOT EXISTS user_score (
    user_id SERIAL PRIMARY KEY,
    user_name VARCHAR(255) UNIQUE NOT NULL,
    xp INTEGER DEFAULT 0, 

);
"""


GET_USERS_XP_GE_100 = """
SELECT user_id, user_name FROM user_score
WHERE xp >= 100;
"""


GET_USERS_XP_GE_500 = """
SELECT user_id, user_name FROM user_score
WHERE xp >= 500;
"""


GET_USERS_XP_GE_1000 = """
SELECT user_id, user_name FROM user_score
WHERE xp >= 1000;
"""


CREATE_TABLE_BADGE = """
CREATE TABLE IF NOT EXISTS badge (
    user_id INTEGER NOT NULL,
    badge_id INTEGER NOT NULL,
    badge_name VARCHAR(255) NOT NULL,
    badge_description VARCHAR(255) NOT NULL,
    unlock_at TIMESTAMP NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, badge_id)
);
"""

INSERT_BADGE = """
INSERT INTO badge (user_id, badge_id, badge_name, badge_description)
VALUES (%s, %s, %s, %s);
"""



