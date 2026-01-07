from flask import Flask
from flask_cors import CORS
from routes.RoleRoute import role_bp
from routes.UserRoute import user_bp
from models.UserModel import Users
from models.RoleModel import Roles
from models.ExpensesModel import Expenses
from routes.ExpensesRoute import expenses_bp
from models.ExpenseSourcesModel import ExpenseSources
from routes.ExpenseSourcesRoute import expense_source_bp
from routes.IncomeSourcesRoute import income_source_bp
from models.IncomeSourcesModel import IncomeSources
from models.IncomesModel import Incomes
from routes.IncomesRoute import incomes_bp
from models.BudgetSummaryModel import BudgetSummary
from routes.BudgetSummaryRoute import budget_summary_bp


app = Flask(__name__)
CORS(app)

app.register_blueprint(role_bp)
app.register_blueprint(user_bp)
app.register_blueprint(expense_source_bp)
app.register_blueprint(expenses_bp)
app.register_blueprint(income_source_bp)
app.register_blueprint(incomes_bp)
app.register_blueprint(budget_summary_bp)





Roles.create_table()
Users.create_table()
ExpenseSources.create_table()
Expenses.create_table()
IncomeSources.create_table()
Incomes.create_table()
BudgetSummary.create_table()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)










