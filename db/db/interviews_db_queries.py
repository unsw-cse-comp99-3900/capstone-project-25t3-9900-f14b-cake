import psycopg2
from psycopg2.extras import RealDictCursor

CREATE_TABLE_INTERVIEWS_DETAIL = """
CREATE TABLE IF NOT EXISTS interviews_detail (
    id BIGSERIAL PRIMARY KEY,

    session_id UUID NOT NULL,

    user_id INTEGER NOT NULL,

    question_id INTEGER NOT NULL,

    type VARCHAR(100) NOT NULL,   
    question TEXT NOT NULL,
    answer TEXT,

    interview_score NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (interview_score >= 0),
    feedback JSONB NOT NULL DEFAULT '{}'::jsonb,


    created_at TIMESTAMP NOT NULL DEFAULT NOW(),

    -- Ensure there is only one record per question position in a session
    UNIQUE (session_id, question_id)
);
"""
# asdf, user1, 1, technical, question1, answer1, 1.0, {}, 2025-10-29 00:00:00
# asdf, user1, 2, technical, question2, answer2, 1.0, {}, 2025-10-29 00:00:00

INSERT_INTERVIEW_DETAIL = """
INSERT INTO interviews_detail (
  session_id, user_id, question_id, type, question, answer, interview_score, feedback
) VALUES
  (  %s::uuid, %s, %s, %s, %s, %s, %s, %s::jsonb),
RETURNING id;
"""

SELECT_INTERVIEW_DETAIL_BY_USER = """
SELECT
  session_id,
  question_no,
  question,
  interview_score,
  feedback,
  created_at
FROM interviews_detail
WHERE user_id = %s
ORDER BY session_id, question_id;
"""

SUM_BY_SESSION = """
SELECT session_id, COALESCE(SUM(interview_score), 0) AS total_score
FROM interviews_detail
WHERE session_id = %s::uuid
GROUP BY session_id;
"""

DELETE_INTERVIEW_DETAIL_BY_USER_AND_SESSION = """
DELETE FROM interviews_detail
WHERE user_id = %s AND session_id = %s::uuid;
"""


def update_interview_detail(conn, session_id: uuid, user_id: int, question_no: int, type: str, question: str, answer: str, interview_score: float, feedback: dict):
    with conn.cursor() as cur:
        cur.execute(INSERT_INTERVIEW_DETAIL, (session_id, user_id, question_id, type, question, answer, interview_score, feedback))
        new_id = cur.fetchone()["id"]
        return new_id

def get_interview_details_by_user(conn, user_id: int):
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(SELECT_INTERVIEW_DETAIL_BY_USER, (user_id,))
        rows = cur.fetchall()
        return rows

def delete_by_user_and_session(conn, user_id: int, session_id_str: str) -> int:
    with conn.cursor() as cur:
        cur.execute(DELETE_INTERVIEW_DETAIL_BY_USER_AND_SESSION, (user_id, session_id_str))
        deleted = cur.rowcount
    conn.commit()
    return deleted



