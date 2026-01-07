from flask import Blueprint, jsonify
from controller.ExpenseSourcesController import ExpenseSourcesController
from auth_decorator import require_admin, require_auth


expense_source_bp = Blueprint('expense_source_bp', __name__)

@expense_source_bp.route('/expense-sources', methods=['POST'])
def create_expense_source():
    return ExpenseSourcesController.create_expense_source()

@expense_source_bp.route('/expense-sources', methods=['GET'])
def get_expense_sources():
    return ExpenseSourcesController.get_expense_sources()

@expense_source_bp.route('/expense-sources/<int:expense_source_id>', methods=['GET'])
@require_auth
def get_expense_source(expense_source_id):
    return ExpenseSourcesController.get_expense_source(expense_source_id)

@expense_source_bp.route('/expense-sources/<int:expense_source_id>', methods=['PUT'])
@require_admin
def update_expense_source(expense_source_id):
    return ExpenseSourcesController.update_expense_source(expense_source_id)

@expense_source_bp.route('/expense-sources/<int:expense_source_id>', methods=['DELETE'])
@require_admin
def delete_expense_source(expense_source_id):
    return ExpenseSourcesController.delete_expense_source(expense_source_id)