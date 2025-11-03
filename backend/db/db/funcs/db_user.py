import psycopg2
from src import db_connect
from src.helpers import hashing
from src.error import InputError
from db.user_detail_queries import *
from create_table_queries import *
from user_db_queries import * 



def find_user_badge_detail(user_name):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute()



def insert_user_detail(user_name, password):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(CREATE_TABLE_USER_DETAIL)
            cursor.execute(INSERT_USER_DETAIL, (user_name, hashing(password)))
            user_id = cursor.fetchone()[0]
    db_connect.connection_pool.putconn(connection)
    return user_id

# 匹配用户名与密码
def match_username_pw(user_name, password):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(CREATE_TABLE_USER_DETAIL)
            cursor.execute(MATCH_USERNAME_PW, (user_name, hashing(password)))
            ret = cursor.fetchall()
    db_connect.connection_pool.putconn(connection)
    if not ret:
        raise InputError("Username or password incorrect")
    return ret[0][0]

# 检查用户名是否存在
def match_username(user_name):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(CREATE_TABLE_USER_DETAIL)
            cursor.execute(CHECK_USER_EXISTS, (user_name))
            ret = cursor.fetchall()
    db_connect.connection_pool.putconn(connection)
    return len(ret) > 0

# 获取用户详细信息
def get_user_detail(user_id):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_USER_DETAIL, (user_id,))
            user = cursor.fetchall()
    db_connect.connection_pool.putconn(connection)
    if user:
        row = user[0]
        return {
            "user_id": row[0],
            "user_name": row[1],
            "password_hash": row[2],
            "interviews": row[3],
            "fav_interviews": row[4],
            "readiness_score": row[5],
            "login_streak": row[6],
            "badges": row[7],
        }
    return None

# 更新用户详情
def update_user_detail(user_id, interviews, fav_interviews, readiness_score, login_streak, badges):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(UPDATE_USER_DETAIL, (
                interviews,
                fav_interviews,
                readiness_score,
                login_streak,
                badges,
                user_id
            ))
    db_connect.connection_pool.putconn(connection)

# 删除用户记录
def delete_user_detail(user_id):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(DELETE_USER_DETAIL, (user_id,))
    db_connect.connection_pool.putconn(connection)
