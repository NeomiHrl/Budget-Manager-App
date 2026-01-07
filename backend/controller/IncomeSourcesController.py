from flask import Flask, jsonify, request
from models.IncomeSourcesModel import IncomeSources
import mysql.connector

class IncomeSourcesController:

    @staticmethod
    def create_income_source():
        try:
            data = request.get_json()
            for item in data:
                income_source_name = item.get('income_source_name')
                if not income_source_name:
                    return jsonify({'message': 'Name is required'}), 400
                result = IncomeSources.create_income_source(income_source_name)
                if result is None:
                    return jsonify({'message': 'Income source already exists'}), 409
            return jsonify(result), 201
        except mysql.connector.Error as err:
            return jsonify({'error': str(err)}), 500

    @staticmethod
    def get_income_sources():
        try:
            incomes = IncomeSources.get_all_income_sources()
            incomes_list = [{'income_source_id': income[0], 'income_source_name': income[1]} for income in incomes]
            return jsonify(incomes_list), 200
        except mysql.connector.Error as err:
            return jsonify({'error': str(err)}), 500
    @staticmethod
    def get_income_source_by_id(income_source_id):
        try:
            income = IncomeSources.get_income_source_by_id(income_source_id)
            if income:
                income_data = {'income_source_id': income[0], 'income_source_name': income[1]}
                return jsonify(income_data), 200
            else:
                return jsonify({'message': 'Income source not found'}), 404
        except mysql.connector.Error as err:
            return jsonify({'error': str(err)}), 500


    @staticmethod
    def update_income_source(income_source_id):
        try:
            data = request.get_json()
            income_source_name = data.get('income_source_name')
            if not income_source_name:
                return jsonify({'message': 'Income source name is required'}), 400
            result = IncomeSources.update_income_source(income_source_id, income_source_name)
            if result == 0:
                return jsonify({'message': 'Income source not found'}), 404
            return jsonify({'message': 'Income source updated successfully'}), 200
        except mysql.connector.Error as err:
            return jsonify({'error': str(err)}), 500

    @staticmethod
    def delete_income_source(income_source_id):
        try:
            result = IncomeSources.delete_income_source(income_source_id)
            if result == 0:
                return jsonify({'message': 'Income source not found'}), 404
            return jsonify({'message': 'Income source deleted successfully'}), 200
        except mysql.connector.Error as err:
            return jsonify({'error': str(err)}), 500
