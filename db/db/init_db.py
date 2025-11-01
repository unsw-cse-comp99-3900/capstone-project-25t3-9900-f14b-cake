import psycopg2
from datetime import datetime
from flask import Flask
import psycopg2.pool
import uuid
from badges_db_queries import * 
from interviews_db_queries import * 
from user_db_queries import * 
from xp_db_queries import * 

connection_pool = psycopg2.pool.SimpleConnectionPool(
    minconn=1,
    maxconn=10,
    host='localhost',
    port='5432',
    database='postgres',
    user='postgres',
    password='root'
)

conn = connection_pool.getconn()
cursor = conn.cursor()

cursor.execute(CREATE_TABLE_USER_DETAIL)
cursor.execute(CREATE_TABLE_INTERVIEWS_DETAIL)

update_interview_detail(conn, uuid.uuid4(), 1, 1, 'technical', 'What is HTTP', 'answerQ1', 1.0, {"note": ok})
update_interview_detail(conn, uuid.uuid4(), 1, 2, 'technical', 'questionQ2', 'answerQ2', 2.0, {})
conn.commit()

cursor.close()
connection_pool.putconn(conn)

conn = connection_pool.getconn()