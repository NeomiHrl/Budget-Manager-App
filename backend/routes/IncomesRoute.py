from flask import Blueprint, jsonify
from controller.IncomesController import IncomesController
from auth_decorator import require_auth

incomes_bp = Blueprint('incomes_bp', __name__)

@incomes_bp.route('/incomes', methods=['POST'])
@require_auth
def create_income():
    return IncomesController.create_income()

@incomes_bp.route('/incomes', methods=['GET'])
@require_auth
def get_incomes():
    return IncomesController.get_incomes()

@incomes_bp.route('/incomes/<int:income_id>', methods=['GET'])
@require_auth
def get_income_by_id(income_id):
    return IncomesController.get_income_by_id(income_id)

@incomes_bp.route('/incomes/user/<int:user_id>', methods=['GET'])
@require_auth
def get_incomes_by_user_id(user_id):
    return IncomesController.get_incomes_by_user_id(user_id)

@incomes_bp.route('/incomes/<int:income_id>', methods=['PUT'])
@require_auth
def update_income(income_id):
    return IncomesController.update_income(income_id)

@incomes_bp.route('/incomes/<int:income_id>', methods=['DELETE'])
@require_auth
def delete_income(income_id):
    return IncomesController.delete_income(income_id)

