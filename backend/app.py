from flask import Flask, send_from_directory
from flask_cors import CORS, cross_origin
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
import os


app = Flask(__name__)
CORS(app, origins=['http://localhost:5173'])

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

@app.route('/users/<int:user_id>/profile-image')
@cross_origin(origins=['http://localhost:5173'])
def get_profile_image(user_id):
    # לוגיקה למציאת שם הקובץ לפי user_id
    return send_from_directory('profile_images', filename)

@app.route('/profile_images/<filename>')
@cross_origin(origins=['http://localhost:5173'])
def serve_profile_image(filename):
    # ודא שהתמונה קיימת
    image_path = os.path.join('backend', 'profile_images', filename)
    if not os.path.exists(image_path):
        return {'error': 'Image not found'}, 404
    return send_from_directory(os.path.join('backend', 'profile_images'), filename)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)










