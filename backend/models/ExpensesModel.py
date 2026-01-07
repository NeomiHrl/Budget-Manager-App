import mysql.connector
from env_config import DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT
import os
from models.BudgetSummaryModel import BudgetSummary

class Expenses:

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
        with Expenses.get_db_connection() as connection:
            cursor = connection.cursor()
            sql = '''CREATE TABLE IF NOT EXISTS expenses (
                    expense_id INT AUTO_INCREMENT PRIMARY KEY,
                    user_id INT NOT NULL,
                    amount DECIMAL(10, 2) NOT NULL,
                    expense_source_id INT NOT NULL,
                    expense_date DATE NOT NULL,
                    expense_description VARCHAR(255),
                    FOREIGN KEY (expense_source_id) REFERENCES expense_sources(expense_source_id),
                    FOREIGN KEY (user_id) REFERENCES users(user_id)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4'''
            cursor.execute(sql)
            cursor.close()
    
    @staticmethod
    def create_expense(user_id, amount, expense_source_id, expense_date, expense_description):
        with Expenses.get_db_connection() as connection:
            cursor = connection.cursor()
            query = '''INSERT INTO expenses 
                       (user_id, amount, expense_source_id, expense_date, expense_description) 
                       VALUES (%s, %s, %s, %s, %s)'''
            cursor.execute(query, (user_id, amount, expense_source_id, expense_date, expense_description))
            connection.commit()
            expense_id = cursor.lastrowid
            cursor.close()

        # עדכון/יצירת תקציר
        if hasattr(expense_date, 'strftime'):
            month = expense_date.strftime('%Y-%m')
        else:
            month = str(expense_date)[:7]
        summaries = BudgetSummary.get_summary_by_user_and_month(user_id, month)
        summary = None
        for s in summaries:
            if s[3] == expense_source_id and s[4] == 'expense':
                summary = s
                break

        if summary:
            new_total_expenses = float(summary[6]) + float(amount)
            BudgetSummary.update_summary(summary[0], summary[5], new_total_expenses, float(summary[5]) - new_total_expenses)
        else:
            BudgetSummary.create_summary(
                user_id=user_id,
                month=month,
                source_id=expense_source_id,
                summary_type='expense',
                total_income=0,
                total_expenses=amount,
                balance=-float(amount)
            )

        return {
            "expense_id": expense_id,
            "user_id": user_id,
            "amount": amount,
            "expense_source_id": expense_source_id,
            "expense_date": expense_date,
            "expense_description": expense_description
        }
    
    @staticmethod
    def get_all_expenses():
        with Expenses.get_db_connection() as connection:
            cursor = connection.cursor()
            query = "SELECT * FROM expenses"
            cursor.execute(query)
            expenses = cursor.fetchall()
            cursor.close()
            return expenses
    
    @staticmethod
    def get_expense_by_id(expense_id):  
        with Expenses.get_db_connection() as connection:
            cursor = connection.cursor()
            query = "SELECT * FROM expenses WHERE expense_id = %s"
            cursor.execute(query, (expense_id,))
            expense = cursor.fetchone()
            cursor.close()
            return expense

    @staticmethod
    def get_expenses_by_user_id(user_id):  
        with Expenses.get_db_connection() as connection:
            cursor = connection.cursor()
            query = "SELECT * FROM expenses WHERE user_id = %s"
            cursor.execute(query, (user_id,))
            expenses = cursor.fetchall()
            cursor.close()
            return expenses

    @staticmethod
    def update_expense(expense_id, amount, expense_source_id, expense_date, expense_description):   
        with Expenses.get_db_connection() as connection:
            cursor = connection.cursor()
            query = '''UPDATE expenses 
                       SET amount = %s, expense_source_id = %s, expense_date = %s, expense_description = %s 
                       WHERE expense_id = %s'''
            cursor.execute(query, (amount, expense_source_id, expense_date, expense_description, expense_id))
            connection.commit()
            rows_affected = cursor.rowcount
            cursor.close()
            return rows_affected

    @staticmethod
    def delete_expense(expense_id):     
        with Expenses.get_db_connection() as connection:
            cursor = connection.cursor()
            query = "DELETE FROM expenses WHERE expense_id = %s"
            cursor.execute(query, (expense_id,))
            connection.commit()
            rows_affected = cursor.rowcount
            cursor.close()
            return rows_affected