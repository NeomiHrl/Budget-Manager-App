from flask import Blueprint,jsonify
from controller.BudgetSummaryController import BudgetSummaryController
from auth_decorator import require_auth, require_admin

budget_summary_bp = Blueprint('budget_summary_bp', __name__)

@budget_summary_bp.route('/budget_summary', methods=['POST'])
@require_auth
def create_budget_summary():
    return BudgetSummaryController.create_budget_summary()

@budget_summary_bp.route('/budget_summary/<int:user_id>/<string:month>', methods=['GET'])
@require_auth
def get_budget_summary(user_id, month):
    return BudgetSummaryController.get_budget_summary(user_id, month)

@budget_summary_bp.route('/budget_summary/<int:budget_id>', methods=['PUT'])
@require_auth
def update_budget_summary(budget_id):
    return BudgetSummaryController.update_budget_summary(budget_id)

@budget_summary_bp.route('/budget_summary/<int:budget_id>', methods=['DELETE'])
@require_admin
def delete_budget_summary(budget_id):
    return BudgetSummaryController.delete_budget_summary(budget_id)

@budget_summary_bp.route('/budget_summary', methods=['GET'])
@require_auth 
def get_all_budget_summaries():
    return BudgetSummaryController.get_all_budget_summaries()
