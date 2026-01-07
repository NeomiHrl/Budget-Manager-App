from flask import Flask, jsonify, request
from models.IncomesModel import Incomes
import mysql.connector

class IncomesController:

    @staticmethod
    def create_income():
        try:
            data = request.get_json()
            user_id = data.get('user_id')
            amount = data.get('amount') 
            income_source_id = data.get('income_source_id')
            income_date = data.get('income_date')
            income_description = data.get('income_description')

            if not all([user_id, amount, income_source_id, income_date]):
                return jsonify({'message': 'אנא מלא את כל השדות הנדרשים'}), 400
            result = Incomes.create_income(user_id, amount, income_source_id, income_date, income_description)
            return jsonify(result), 201
        except mysql.connector.Error as err:
            return jsonify({'error': str(err)}), 500

    @staticmethod
    def get_incomes():
        try:
            incomes = Incomes.get_all_incomes()
            incomes_list = [{
                'income_id': income[0],
                'user_id': income[1],
                'amount': float(income[2]),
                'income_source_id': income[3],
                'income_date': income[4].isoformat(),
                'income_description': income[5]
            } for income in incomes]
            return jsonify(incomes_list), 200
        except mysql.connector.Error as err:
            return jsonify({'error': str(err)}), 500

    @staticmethod
    def get_income_by_id(income_id):
        try:
            income = Incomes.get_income_by_id(income_id)
            if income:
                income_data = {
                    'income_id': income[0],
                    'user_id': income[1],
                    'amount': float(income[2]),
                    'income_source_id': income[3],
                    'income_date': income[4].isoformat(),
                    'income_description': income[5]
                }
                return jsonify(income_data), 200
            else:
                return jsonify({'message': 'הכנסה לא נמצאה'}), 404
        except mysql.connector.Error as err:
            return jsonify({'error': str(err)}), 500


    @staticmethod
    def get_incomes_by_user_id(user_id):
        try:
            incomes = Incomes.get_incomes_by_user_id(user_id)
            incomes_list = [{
                'income_id': income[0],
                'user_id': income[1],
                'amount': float(income[2]),
                'income_source_id': income[3],
                'income_date': income[4].isoformat(),
                'income_description': income[5]
            } for income in incomes]
            return jsonify(incomes_list), 200
        except mysql.connector.Error as err:
            return jsonify({'error': str(err)}), 500

    @staticmethod
    def update_income(income_id):
        try:
            data = request.get_json()
            amount = data.get('amount')
            income_source_id = data.get('income_source_id')
            income_date = data.get('income_date')
            income_description = data.get('income_description')

            if not all([amount, income_source_id, income_date]):
                return jsonify({'message': 'אנא מלא את כל השדות הנדרשים'}), 400

            result = Incomes.update_income(income_id, amount, income_source_id, income_date, income_description)
            if result:
                return jsonify({'message': 'ההכנסה עודכנה בהצלחה'}), 200
            else:
                return jsonify({'message': 'הכנסה לא נמצאה'}), 404
        except mysql.connector.Error as err:
            return jsonify({'error': str(err)}), 500

    @staticmethod
    def delete_income(income_id):
        try:
            result = Incomes.delete_income(income_id)
            if result:
                return jsonify({'message': 'ההכנסה נמחקה בהצלחה'}), 200
            else:
                return jsonify({'message': 'הכנסה לא נמצאה'}), 404
        except mysql.connector.Error as err:
            return jsonify({'error': str(err)}), 500
