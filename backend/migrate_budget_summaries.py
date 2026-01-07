import sys
from models.IncomesModel import Incomes
from models.ExpensesModel import Expenses
from models.BudgetSummaryModel import BudgetSummary


def migrate_incomes():
    print("מעדכן תקצירים מהכנסות...")
    incomes = Incomes.get_all_incomes()
    for income in incomes:
        user_id = income[1]
        amount = income[2]
        income_source_id = income[3]
        income_date = income[4]
        # נשתמש בלוגיקה שכבר קיימת ב-create_income
        Incomes.create_income(user_id, amount, income_source_id, income_date, income[5])
    print("סיום הכנסות.")

def migrate_expenses():
    print("מעדכן תקצירים מהוצאות...")
    expenses = Expenses.get_all_expenses()
    for expense in expenses:
        user_id = expense[1]
        amount = expense[2]
        expense_source_id = expense[3]
        expense_date = expense[4]
        Expenses.create_expense(user_id, amount, expense_source_id, expense_date, expense[5])
    print("סיום הוצאות.")

if __name__ == "__main__":
    migrate_incomes()
    migrate_expenses()
    print("הסקריפט הסתיים!")
