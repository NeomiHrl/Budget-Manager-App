import mysql.connector
from env_config import DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT
import os

class IncomeSources:
    
    @staticmethod
    def get_db_connection():
        return mysql.connector.connect(
            host=DB_HOST,
            port=DB_PORT,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD
        )

    @staticmethod
    def create_table():
        with IncomeSources.get_db_connection() as connection:
            cursor = connection.cursor()
            sql = '''CREATE TABLE IF NOT EXISTS income_sources (
                    income_source_id INT AUTO_INCREMENT PRIMARY KEY,
                    income_source_name VARCHAR(100) NOT NULL
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4'''
            cursor.execute(sql)
            cursor.close()
    
    @staticmethod
    def create_income_source(income_source_name):
        with IncomeSources.get_db_connection() as connection:
            cursor = connection.cursor()
            cursor.execute('SELECT * FROM income_sources WHERE income_source_name=%s', (income_source_name,))
            is_exist = cursor.fetchone()
            if is_exist:
                return None
            query = "INSERT INTO income_sources (income_source_name) VALUES (%s)"
            cursor.execute(query, (income_source_name,))
            connection.commit()
            cursor.close()
            return {
                "income_source_id": cursor.lastrowid,
                "income_source_name": income_source_name
            }

    @staticmethod
    def get_all_income_sources():
        with IncomeSources.get_db_connection() as connection:
            cursor = connection.cursor()
            query = "SELECT * FROM income_sources"
            cursor.execute(query)
            income_sources = cursor.fetchall()
            cursor.close()
            return income_sources

    @staticmethod
    def get_income_source_by_id(income_source_id):
        with IncomeSources.get_db_connection() as connection:
            cursor = connection.cursor()
            query = "SELECT * FROM income_sources WHERE income_source_id = %s"
            cursor.execute(query, (income_source_id,))
            income_source = cursor.fetchone()
            cursor.close()
            return income_source

    @staticmethod
    def update_income_source(income_source_id, income_source_name):   
        with IncomeSources.get_db_connection() as connection:
            cursor = connection.cursor()
            query = "UPDATE income_sources SET income_source_name = %s WHERE income_source_id = %s"
            cursor.execute(query, (income_source_name, income_source_id))
            connection.commit()
            rows_affected = cursor.rowcount
            cursor.close()
            return rows_affected

    @staticmethod
    def delete_income_source(income_source_id):
        with IncomeSources.get_db_connection() as connection:
            cursor = connection.cursor()
            query = "DELETE FROM income_sources WHERE income_source_id = %s"
            cursor.execute(query, (income_source_id,))
            connection.commit()
            rows_affected = cursor.rowcount
            cursor.close()
            return rows_affected

