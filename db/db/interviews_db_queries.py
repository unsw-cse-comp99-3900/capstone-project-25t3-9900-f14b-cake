# === INSERT ===
INSERT_INTERVIEW = """
INSERT INTO interviews (type, question, answer, feedback, score, date, user_id)
VALUES (%s, %s, %s, %s, %s::jsonb, %s, %s)
RETURNING interview_id;
"""

# === SELECT ===
SELECT_INTERVIEW_BY_ID = "SELECT * FROM interviews WHERE interview_id = %s;"
SELECT_INTERVIEWS_BY_USER = "SELECT * FROM interviews WHERE user_id = %s ORDER BY date DESC;"
GET_ALL_INTERVIEWS = "SELECT * FROM interviews ORDER BY interview_id;"

# === UPDATE ===
UPDATE_INTERVIEW_BY_ID = """
UPDATE interviews SET
    type = %s,
    question = %s,
    answer = %s,
    feedback = %s,
    score = %s::jsonb,
    date = %s
WHERE interview_id = %s
RETURNING *;
"""

# === DELETE ===
DELETE_INTERVIEW_BY_ID = "DELETE FROM interviews WHERE interview_id = %s;"
DELETE_INTERVIEWS_BY_USER = "DELETE FROM interviews WHERE user_id = %s;"

# === Field-specific updates ===
UPDATE_INTERVIEW_FEEDBACK = "UPDATE interviews SET feedback = %s WHERE interview_id = %s RETURNING feedback;"
UPDATE_INTERVIEW_SCORE = "UPDATE interviews SET score = %s::jsonb WHERE interview_id = %s RETURNING score;"
UPDATE_INTERVIEW_ANSWER = "UPDATE interviews SET answer = %s WHERE interview_id = %s RETURNING answer;"

# === Analytics / helpers ===
GET_AVG_SCORE_BY_USER = """
SELECT user_id, AVG((jsonb_array_elements_text(score))::NUMERIC)
FROM interviews
WHERE user_id = %s
GROUP BY user_id;
"""
