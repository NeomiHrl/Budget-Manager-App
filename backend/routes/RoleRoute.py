from flask import Blueprint, jsonify
from controller.RoleController import RoleController
from auth_decorator import require_admin

role_bp = Blueprint('role_bp', __name__)

@role_bp.route('/roles', methods=['POST'])
@require_admin
def create_role():
    return RoleController.create_role()

@role_bp.route('/roles', methods=['GET'])
@require_admin
def get_roles():
    return RoleController.get_roles()

@role_bp.route('/roles/<int:role_id>', methods=['GET'])
@require_admin
def get_role_by_id(role_id):
    return RoleController.get_role_by_id(role_id)

@role_bp.route('/roles/<int:role_id>', methods=['PUT'])
@require_admin
def update_role(role_id):
    return RoleController.update_role(role_id)

@role_bp.route('/roles/<int:role_id>', methods=['DELETE'])
@require_admin
def delete_role(role_id):
    return RoleController.delete_role(role_id)
  