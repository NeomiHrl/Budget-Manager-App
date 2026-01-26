import mysql.connector
from env_config import DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT
import os

class ExpenseSources:
    
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
        with ExpenseSources.get_db_connection() as connection:
            cursor = connection.cursor()
            sql = '''CREATE TABLE IF NOT EXISTS expense_sources (
                    expense_source_id INT AUTO_INCREMENT PRIMARY KEY,
                    expense_source_name VARCHAR(100) NOT NULL
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4'''
            cursor.execute(sql)
            cursor.close()
    
    @staticmethod
    def create_expense_source(expense_source_name):
        with ExpenseSources.get_db_connection() as connection:
            cursor = connection.cursor()
            cursor.execute('SELECT * FROM expense_sources WHERE expense_source_name=%s', (expense_source_name,))
            is_exist = cursor.fetchone()
            if is_exist:
                return None
            query = "INSERT INTO expense_sources (expense_source_name) VALUES (%s)"
            cursor.execute(query, (expense_source_name,))
            connection.commit()
            cursor.close()
            return {
                "expense_source_id": cursor.lastrowid,
                "expense_source_name": expense_source_name
            }

    @staticmethod
    def get_all_expense_sources():
        with ExpenseSources.get_db_connection() as connection:
            cursor = connection.cursor()
            query = "SELECT * FROM expense_sources ORDER BY (expense_source_name = 'שונות'), expense_source_name"
            cursor.execute(query)
            expenses = cursor.fetchall()
            cursor.close()
            return expenses

    @staticmethod
    def get_expense_source_by_id(expense_source_id):
        with ExpenseSources.get_db_connection() as connection:
            cursor = connection.cursor()
            query = "SELECT * FROM expense_sources WHERE expense_source_id = %s"
            cursor.execute(query, (expense_source_id,))
            expense = cursor.fetchone()
            cursor.close()
            return expense

    @staticmethod
    def update_expense_source(expense_source_id, expense_source_name):   
        with ExpenseSources.get_db_connection() as connection:
            cursor = connection.cursor()
            query = "UPDATE expense_sources SET expense_source_name = %s WHERE expense_source_id = %s"
            cursor.execute(query, (expense_source_name, expense_source_id))
            connection.commit()
            rows_affected = cursor.rowcount
            cursor.close()
            return rows_affected

    @staticmethod
    def delete_expense_source(expense_source_id):
        with ExpenseSources.get_db_connection() as connection:
            cursor = connection.cursor()
            query = "DELETE FROM expense_sources WHERE expense_source_id = %s"
            cursor.execute(query, (expense_source_id,))
            connection.commit()
            rows_affected = cursor.rowcount
            cursor.close()
            return rows_affected

