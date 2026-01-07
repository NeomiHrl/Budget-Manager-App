from flask import Flask, jsonify, request
from models.ExpensesModel import Expenses
import mysql.connector

class ExpensesController:

    @staticmethod
    def create_expense():
        try:
            data = request.get_json()
            expense_id = data.get('expense_id')
            user_id = data.get('user_id')
            amount = data.get('amount') 
            expense_source_id = data.get('expense_source_id')
            expense_date = data.get('expense_date')
            expense_description = data.get('expense_description')

            if not all([user_id, amount, expense_source_id, expense_date]):
                return jsonify({'message': 'אנא מלא את כל השדות הנדרשים'}), 400
            result = Expenses.create_expense(user_id, amount, expense_source_id, expense_date, expense_description)
            return jsonify(result), 201
        except mysql.connector.Error as err:
            return jsonify({'error': str(err)}), 500

    @staticmethod
    def get_expenses():
        try:
            expenses = Expenses.get_all_expenses()
            expenses_list = [{
                'expense_id': expense[0],
                'user_id': expense[1],
                'amount': float(expense[2]),
                'expense_source_id': expense[3],
                'expense_date': expense[4].isoformat(),
                'expense_description': expense[5]
            } for expense in expenses]
            return jsonify(expenses_list), 200
        except mysql.connector.Error as err:
            return jsonify({'error': str(err)}), 500

    @staticmethod
    def get_expense_by_id(expense_id):
        try:
            expense = Expenses.get_expense_by_id(expense_id)
            if expense:
                expense_data = {
                    'expense_id': expense[0],
                    'user_id': expense[1],
                    'amount': float(expense[2]),
                    'expense_source_id': expense[3],
                    'expense_date': expense[4].isoformat(),
                    'expense_description': expense[5]
                }
                return jsonify(expense_data), 200
            else:
                return jsonify({'message': 'הוצאה לא נמצאה'}), 404
        except mysql.connector.Error as err:
            return jsonify({'error': str(err)}), 500


    @staticmethod
    def get_expenses_by_user_id(user_id):
        try:
            expenses = Expenses.get_expenses_by_user_id(user_id)
            expenses_list = [{
                'expense_id': expense[0],
                'user_id': expense[1],
                'amount': float(expense[2]),
                'expense_source_id': expense[3],
                'expense_date': expense[4].isoformat(),
                'expense_description': expense[5]
            } for expense in expenses]
            return jsonify(expenses_list), 200
        except mysql.connector.Error as err:
            return jsonify({'error': str(err)}), 500

    @staticmethod
    def update_expense(expense_id):
        try:
            data = request.get_json()
            amount = data.get('amount')
            expense_source_id = data.get('expense_source_id')
            expense_date = data.get('expense_date')
            expense_description = data.get('expense_description')

            if not all([amount, expense_source_id, expense_date]):
                return jsonify({'message': 'אנא מלא את כל השדות הנדרשים'}), 400

            result = Expenses.update_expense(expense_id, amount, expense_source_id, expense_date, expense_description)
            if result:
                return jsonify({'message': 'ההוצאה עודכנה בהצלחה'}), 200
            else:
                return jsonify({'message': 'הוצאה לא נמצאה'}), 404
        except mysql.connector.Error as err:
            return jsonify({'error': str(err)}), 500

    @staticmethod
    def delete_expense(expense_id):
        try:
            result = Expenses.delete_expense(expense_id)
            if result:
                return jsonify({'message': 'ההוצאה נמחקה בהצלחה'}), 200
            else:
                return jsonify({'message': 'הוצאה לא נמצאה'}), 404
        except mysql.connector.Error as err:
            return jsonify({'error': str(err)}), 500
