from flask import Flask, jsonify, request
from models.ExpenseSourcesModel import ExpenseSources
import mysql.connector

class ExpenseSourcesController:

    @staticmethod
    def create_expense_source():
        try:
            data = request.get_json()
            if isinstance(data, dict):
                data = [data]
            for item in data:
                expense_source_name = item.get('expense_source_name')
                if not expense_source_name:
                    return jsonify({'message': 'Name is required'}), 400
                result = ExpenseSources.create_expense_source(expense_source_name)
                if result is None:
                    return jsonify({'message': 'Expense source already exists'}), 409
            return jsonify(result), 201
        except mysql.connector.Error as err:
            return jsonify({'error': str(err)}), 500

    @staticmethod
    def get_expense_sources():
        try:
            expenses = ExpenseSources.get_all_expense_sources()
            expenses_list = [{'expense_source_id': expense[0], 'expense_source_name': expense[1]} for expense in expenses]
            return jsonify(expenses_list), 200
        except mysql.connector.Error as err:
            return jsonify({'error': str(err)}), 500
    @staticmethod
    def get_expense_source_by_id(expense_source_id):
        try:
            expense = ExpenseSources.get_expense_source_by_id(expense_source_id)
            if expense:
                expense_data = {'expense_source_id': expense[0], 'expense_source_name': expense[1]}
                return jsonify(expense_data), 200
            else:
                return jsonify({'message': 'Expense source not found'}), 404
        except mysql.connector.Error as err:
            return jsonify({'error': str(err)}), 500


    @staticmethod
    def update_expense_source(expense_source_id):
        try:
            data = request.get_json()
            expense_source_name = data.get('expense_source_name')
            if not expense_source_name:
                return jsonify({'message': 'Expense source name is required'}), 400
            result = ExpenseSources.update_expense_source(expense_source_id, expense_source_name)
            if result == 0:
                return jsonify({'message': 'Expense source not found'}), 404
            return jsonify({'message': 'Expense source updated successfully'}), 200
        except mysql.connector.Error as err:
            return jsonify({'error': str(err)}), 500

    @staticmethod
    def delete_expense_source(expense_source_id):
        try:
            result = ExpenseSources.delete_expense_source(expense_source_id)
            if result == 0:
                return jsonify({'message': 'Expense source not found'}), 404
            return jsonify({'message': 'Expense source deleted successfully'}), 200
        except mysql.connector.Error as err:
            return jsonify({'error': str(err)}), 500
