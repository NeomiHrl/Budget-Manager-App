from flask import send_from_directory
import os
from flask import Blueprint, request, jsonify
from controller.UserController import UserController
from auth_decorator import require_auth, require_admin

user_bp = Blueprint('user_bp', __name__)


@user_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    return UserController.forgot_password()
    

@user_bp.route('/reset-password', methods=['POST'])
def reset_password():
    return UserController.reset_password()


@user_bp.route('/users', methods=['POST'])
def create_user():
    return UserController.create_user()

@user_bp.route('/users', methods=['GET'])
@require_auth
def get_users():
    return UserController.get_users()

@user_bp.route('/users/<int:user_id>', methods=['GET'])
@require_auth
def get_user_by_id(user_id):
    return UserController.get_user_by_id(user_id)

@user_bp.route('/users/<int:user_id>', methods=['PUT'])
@require_auth
def update_user(user_id):
    return UserController.update_user(user_id)

@user_bp.route('/users/<int:user_id>', methods=['DELETE'])
@require_auth
def delete_user(user_id):
    return UserController.delete_user(user_id)

@user_bp.route('/users/login', methods=['POST'])
def login_user():
    return UserController.login_user()

@user_bp.route('/auth/check', methods=['GET'])
@require_auth
def check_token():
    return jsonify({"ok": True})

@user_bp.route('/users/<int:user_id>/change-password', methods=['PUT'])
@require_auth
def change_password(user_id):
    return UserController.change_password(user_id)

from flask_cors import cross_origin

@user_bp.route('/users/<int:user_id>/upload-profile-image', methods=['POST'])
def upload_profile_image(user_id):
    return UserController.upload_profile_image(user_id)

