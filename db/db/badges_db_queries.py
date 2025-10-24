# === INSERT ===
INSERT_BADGE = """
INSERT INTO badges (type, description, unlock_date, user_id)
VALUES (%s, %s, %s, %s)
RETURNING badge_id;
"""

# === SELECT ===
SELECT_BADGE_BY_ID = "SELECT * FROM badges WHERE badge_id = %s;"
SELECT_BADGES_BY_USER = "SELECT * FROM badges WHERE user_id = %s ORDER BY unlock_date DESC;"
GET_ALL_BADGES = "SELECT * FROM badges ORDER BY badge_id;"

# === UPDATE ===
UPDATE_BADGE_BY_ID = """
UPDATE badges SET
    type = %s,
    description = %s,
    unlock_date = %s
WHERE badge_id = %s
RETURNING *;
"""

# === DELETE ===
DELETE_BADGE_BY_ID = "DELETE FROM badges WHERE badge_id = %s;"
DELETE_BADGES_BY_USER = "DELETE FROM badges WHERE user_id = %s;"

# # === Helper ===
# COUNT_BADGES_BY_USER = "SELECT COUNT(*) FROM badges WHERE user_id = %s;"
# GET_LATEST_BADGE = "SELECT * FROM badges WHERE user_id = %s ORDER BY unlock_date DESC LIMIT 1;"

