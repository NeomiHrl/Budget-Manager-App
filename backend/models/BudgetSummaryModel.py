import mysql.connector
from env_config import DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT
import os

class BudgetSummary:

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
        with BudgetSummary.get_db_connection() as connection:
            cursor = connection.cursor()
            sql = '''CREATE TABLE IF NOT EXISTS budget_summary (
                    summary_id INT AUTO_INCREMENT PRIMARY KEY,
                    user_id INT NOT NULL,
                    month VARCHAR(7) NOT NULL,
                    source_id INT NOT NULL,
                    summary_type ENUM('income', 'expense') NOT NULL,
                    total_income DECIMAL(10, 2) DEFAULT 0,
                    total_expenses DECIMAL(10, 2) DEFAULT 0,
                    balance DECIMAL(10, 2) DEFAULT 0,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users(user_id)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4'''
            cursor.execute(sql)
            cursor.close()
    
    @staticmethod
    def create_summary(user_id, month, source_id, summary_type, total_income, total_expenses, balance):
        with BudgetSummary.get_db_connection() as connection:
            cursor = connection.cursor()
            sql = '''INSERT INTO budget_summary 
                     (user_id, month, source_id, summary_type, total_income, total_expenses, balance) 
                     VALUES (%s, %s, %s, %s, %s, %s, %s)'''
            cursor.execute(sql, (user_id, month, source_id, summary_type, total_income, total_expenses, balance))
            connection.commit()  
            cursor.close()
            return {
                "summary_id": cursor.lastrowid,
                "user_id": user_id,
                "month": month,
                "source_id": source_id,
                "summary_type": summary_type,
                "total_income": total_income,
                "total_expenses": total_expenses,
                "balance": balance
            }


    @staticmethod
    def get_summary_by_user_and_month(user_id, month):
        with BudgetSummary.get_db_connection() as connection:
            cursor = connection.cursor()
            sql = '''SELECT * FROM budget_summary WHERE user_id = %s AND month = %s'''
            cursor.execute(sql, (user_id, month))
            result = cursor.fetchall()
            cursor.close()
            return result
    
    @staticmethod
    def update_summary(summary_id, total_income, total_expenses, balance):
        with BudgetSummary.get_db_connection() as connection:
            cursor = connection.cursor()
            sql = '''UPDATE budget_summary 
                     SET total_income = %s, total_expenses = %s, balance = %s 
                     WHERE summary_id = %s'''
            cursor.execute(sql, (total_income, total_expenses, balance, summary_id))
            connection.commit()
            cursor.close()

    @staticmethod
    def delete_summary(summary_id):
        with BudgetSummary.get_db_connection() as connection:
            cursor = connection.cursor()
            sql = '''DELETE FROM budget_summary WHERE summary_id = %s'''
            cursor.execute(sql, (summary_id,))
            connection.commit()
            cursor.close()
    
    @staticmethod
    def get_all_summaries():
        with BudgetSummary.get_db_connection() as connection:
            cursor = connection.cursor()
            sql = '''SELECT * FROM budget_summary'''
            cursor.execute(sql)
            results = cursor.fetchall()
            cursor.close()
            return results
    
