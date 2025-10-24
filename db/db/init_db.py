import psycopg2
from datetime import datetime
from flask import Flask
import psycopg2.pool
import sys
import binascii
sys.path.append('db')
from badges_db_queries import * 
from interviews_db_queries import * 
from user_db_queries import * 
from create_table_queries import * 

connection_pool = psycopg2.pool.SimpleConnectionPool(
    minconn=1,
    maxconn=10,
    host='localhost',
    port='5432',
    database='mydb',
    user='admin',
    password='123456'
)

conn = connection_pool.getconn()
cursor = conn.cursor()

cursor.execute(CREATE_TABLE_USER_DETAIL)
cursor.execute(CREATE_TABLE_INTERVIEW_DETAIL)
cursor.execute(CREATE_TABLE_QUESTION_DETAIL)
cursor.execute(CREATE_TABLE_USER_INTERVIEW)
cursor.execute(CREATE_TABLE_INTERVIEW_QUESTION)


conn.commit()

cursor.close()
connection_pool.putconn(conn)

conn = connection_pool.getconn()