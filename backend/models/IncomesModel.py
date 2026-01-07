
import mysql.connector
from env_config import DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT
import os
from models.BudgetSummaryModel import BudgetSummary

class Incomes:

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
        with Incomes.get_db_connection() as connection:
            cursor = connection.cursor()
            sql = '''CREATE TABLE IF NOT EXISTS incomes (
                    income_id INT AUTO_INCREMENT PRIMARY KEY,
                    user_id INT NOT NULL,
                    amount DECIMAL(10, 2) NOT NULL,
                    income_source_id INT NOT NULL,
                    income_date DATE NOT NULL,
                    income_description VARCHAR(255),
                    FOREIGN KEY (income_source_id) REFERENCES income_sources(income_source_id),
                    FOREIGN KEY (user_id) REFERENCES users(user_id)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4'''
            cursor.execute(sql)
            cursor.close()
    
    @staticmethod
    def create_income(user_id, amount, income_source_id, income_date, income_description):
        with Incomes.get_db_connection() as connection:
            cursor = connection.cursor()
            query = '''INSERT INTO incomes 
                       (user_id, amount, income_source_id, income_date, income_description) 
                       VALUES (%s, %s, %s, %s, %s)'''
            cursor.execute(query, (user_id, amount, income_source_id, income_date, income_description))
            connection.commit()
            income_id = cursor.lastrowid
            cursor.close()

        # עדכון/יצירת תקציר
        if hasattr(income_date, 'strftime'):
            month = income_date.strftime('%Y-%m')
        else:
            month = str(income_date)[:7]
        summaries = BudgetSummary.get_summary_by_user_and_month(user_id, month)
        summary = None
        for s in summaries:
            if s[3] == income_source_id and s[4] == 'income':
                summary = s
                break

        if summary:
            new_total_income = float(summary[5]) + float(amount)
            BudgetSummary.update_summary(summary[0], new_total_income, summary[6], new_total_income - float(summary[6]))
        else:
            BudgetSummary.create_summary(
                user_id=user_id,
                month=month,
                source_id=income_source_id,
                summary_type='income',
                total_income=amount,
                total_expenses=0,
                balance=amount
            )

        return {
            "income_id": income_id,
            "user_id": user_id,
            "amount": amount,
            "income_source_id": income_source_id,
            "income_date": income_date,
            "income_description": income_description
        }
    
    @staticmethod
    def get_all_incomes():
        with Incomes.get_db_connection() as connection:
            cursor = connection.cursor()
            query = "SELECT * FROM incomes"
            cursor.execute(query)
            incomes = cursor.fetchall()
            cursor.close()
            return incomes

    @staticmethod
    def get_income_by_id(income_id):  
        with Incomes.get_db_connection() as connection:
            cursor = connection.cursor()
            query = "SELECT * FROM incomes WHERE income_id = %s"
            cursor.execute(query, (income_id,))
            income = cursor.fetchone()
            cursor.close()
            return income

    @staticmethod
    def get_incomes_by_user_id(user_id):  
        with Incomes.get_db_connection() as connection:
            cursor = connection.cursor()
            query = "SELECT * FROM incomes WHERE user_id = %s"
            cursor.execute(query, (user_id,))
            incomes = cursor.fetchall()
            cursor.close()
            return incomes

    @staticmethod
    def update_income(income_id, amount, income_source_id, income_date, income_description):   
        with Incomes.get_db_connection() as connection:
            cursor = connection.cursor()
            query = '''UPDATE incomes
                       SET amount = %s, income_source_id = %s, income_date = %s, income_description = %s
                       WHERE income_id = %s'''
            cursor.execute(query, (amount, income_source_id, income_date, income_description, income_id))
            connection.commit()
            rows_affected = cursor.rowcount
            cursor.close()
            return rows_affected

    @staticmethod
    def delete_income(income_id):     
        with Incomes.get_db_connection() as connection:
            cursor = connection.cursor()
            query = "DELETE FROM incomes WHERE income_id = %s"
            cursor.execute(query, (income_id,))
            connection.commit()
            rows_affected = cursor.rowcount
            cursor.close()
            return rows_affected