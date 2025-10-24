# === INSERT ===
INSERT_USER = """
INSERT INTO user_detail
(user_name, password_hash, interviews, fav_interviews, readiness_score, login_streak, xp, badges)
VALUES (%s, %s, %s::jsonb, %s::jsonb, %s, %s, %s, %s::jsonb)
RETURNING user_id;
"""

INSERT_USER_DETAIL = """
INSERT INTO user_detail (user_name, password_hash)
VALUES (%s, %s)
RETURNING user_id;
"""

MATCH_USERNAME_PW = """
SELECT user_id FROM user_detail
WHERE user_name = %s AND password_hash = %s;
"""

# === SELECT ===
GET_USER_DETAIL = """SELECT * FROM user_detail WHERE user_id = %s;"""
SELECT_USER_BY_NAME = "SELECT * FROM user_detail WHERE user_name = %s;"
GET_USER_PASSWORD = "SELECT password_hash FROM user_detail WHERE user_name = %s;"

# === UPDATE ===
UPDATE_USER_BY_ID = """
UPDATE user_detail SET
    user_name = %s,
    password_hash = %s,
    interviews = %s::jsonb,
    fav_interviews = %s::jsonb,
    readiness_score = %s,
    login_streak = %s,
    xp = %s,
    badges = %s::jsonb
WHERE user_id = %s
RETURNING *;
"""

DELETE_USER_BY_ID = "DELETE FROM user_detail WHERE user_id = %s;"

GET_ALL_USERS = "SELECT * FROM user_detail ORDER BY user_id;"

# === Field-specific JSON updates ===
UPDATE_INTERVIEWS = "UPDATE user_detail SET interviews = %s::jsonb WHERE user_id = %s RETURNING interviews;"
UPDATE_FAV_INTERVIEWS = "UPDATE user_detail SET fav_interviews = %s::jsonb WHERE user_id = %s RETURNING fav_interviews;"
UPDATE_BADGES = "UPDATE user_detail SET badges = %s::jsonb WHERE user_id = %s RETURNING badges;"

# === Atomic numeric updates ===
INCREMENT_LOGIN_STREAK = """
UPDATE user_detail
SET login_streak = login_streak + 1
WHERE user_id = %s
RETURNING login_streak;
"""

RESET_LOGIN_STREAK = """
UPDATE user_detail
SET login_streak = 0
WHERE user_id = %s
RETURNING login_streak;
"""

ADD_XP = """
UPDATE user_detail
SET xp = xp + %s
WHERE user_id = %s
RETURNING xp;
"""

# === Existence / helper checks ===
CHECK_USER_EXISTS = "SELECT 1 FROM user_detail WHERE user_name = %s LIMIT 1;"
