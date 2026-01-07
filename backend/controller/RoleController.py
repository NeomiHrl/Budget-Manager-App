from flask import Flask, request, jsonify
from models.RoleModel import Roles
import mysql.connector

class RoleController:

    @staticmethod
    def create_role():
        try:
            data = request.get_json()
            name = data.get('name')
            if not name:
                return jsonify({'message': 'Name is required'}), 400
            result = Roles.create_role(name)
            if result is None:
                return jsonify({'message': 'Role already exists'}), 409
            return jsonify(result), 201
        except mysql.connector.Error as err:
            return jsonify({'error': str(err)}), 500

    @staticmethod
    def get_roles():
        try:
            roles = Roles.get_all_roles()
            roles_list = [{'role_id': role[0], 'name': role[1]} for role in roles]
            return jsonify(roles_list), 200
        except mysql.connector.Error as err:
            return jsonify({'error': str(err)}), 500

    @staticmethod
    def get_role_by_id(role_id):
        try:
            role = Roles.get_role_by_id(role_id)
            if role:
                role_data = {'role_id': role[0], 'name': role[1]}
                return jsonify(role_data), 200
            else:
                return jsonify({'message': 'Role not found'}), 404
        except mysql.connector.Error as err:
            return jsonify({'error': str(err)}), 500

    @staticmethod
    def update_role(role_id):
        try:
            data = request.get_json()
            name = data.get('name')
            if not name:
                return jsonify({'message': 'Name is required'}), 400
            rows_affected = Roles.update_role(role_id, name)
            if rows_affected:
                return jsonify({'role_id': role_id, 'name': name}), 200
            else:
                return jsonify({'message': 'Role not found'}), 404
        except mysql.connector.Error as err:
            return jsonify({'error': str(err)}), 500
    
    @staticmethod
    def delete_role(role_id):
        try:
            rows_affected = Roles.delete_role(role_id)
            if rows_affected:
                return jsonify({'message': 'Role deleted successfully'}), 200
            else:
                return jsonify({'message': 'Role not found'}), 404
        except mysql.connector.Error as err:
            return jsonify({'error': str(err)}), 500
