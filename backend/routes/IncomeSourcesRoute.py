from flask import Blueprint, jsonify
from controller.IncomeSourcesController import IncomeSourcesController
from auth_decorator import require_admin, require_auth


income_source_bp = Blueprint('income_source_bp', __name__)

@income_source_bp.route('/income-sources', methods=['POST'])
def create_income_source():
    return IncomeSourcesController.create_income_source()

@income_source_bp.route('/income-sources', methods=['GET'])
def get_income_sources():
    return IncomeSourcesController.get_income_sources()

@income_source_bp.route('/income-sources/<int:income_source_id>', methods=['GET'])
@require_auth
def get_income_source(income_source_id):
    return IncomeSourcesController.get_income_source(income_source_id)

@income_source_bp.route('/income-sources/<int:income_source_id>', methods=['PUT'])
@require_admin
def update_income_source(income_source_id):
    return IncomeSourcesController.update_income_source(income_source_id)

@income_source_bp.route('/income-sources/<int:income_source_id>', methods=['DELETE'])
@require_admin
def delete_income_source(income_source_id):
    return IncomeSourcesController.delete_income_source(income_source_id)