import os
# from src import config
import psycopg2
from psycopg2 import pool


connection_pool = psycopg2.pool.SimpleConnectionPool(
                    minconn=1,
                    maxconn=10,
                    host='localhost',
                    port='5432',
                    database='postgres',
                    user='postgres',
                    password='root'
                )
