from flask import Blueprint, jsonify
from controller.ExpensesController import ExpensesController
from auth_decorator import  require_auth

expenses_bp = Blueprint('expenses', __name__)

@expenses_bp.route('/expenses', methods=['POST'])
@require_auth
def create_expense():
    return ExpensesController.create_expense()

@expenses_bp.route('/expenses', methods=['GET'])
@require_auth
def get_expenses():
    return ExpensesController.get_expenses()

@expenses_bp.route('/expenses/<int:expense_id>', methods=['GET'])
@require_auth
def get_expense(expense_id):
    return ExpensesController.get_expense_by_id(expense_id)

@expenses_bp.route('/expenses/user/<int:user_id>', methods=['GET'])
@require_auth
def get_expenses_by_user(user_id):
    return ExpensesController.get_expenses_by_user_id(user_id)

@expenses_bp.route('/expenses/<int:expense_id>', methods=['PUT'])
@require_auth
def update_expense(expense_id):
    return ExpensesController.update_expense(expense_id)

@expenses_bp.route('/expenses/<int:expense_id>', methods=['DELETE'])
@require_auth
def delete_expense(expense_id):
    return ExpensesController.delete_expense(expense_id)
