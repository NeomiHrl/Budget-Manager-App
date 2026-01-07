from flask import Flask, jsonify, request
from models.BudgetSummaryModel import BudgetSummary
import mysql.connector

class BudgetSummaryController:

    @staticmethod
    def create_budget_summary():
        data = request.get_json()
        required_fields = ['user_id', 'month', 'source_id', 'summary_type', 'total_income', 'total_expenses', 'balance']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing fields'}), 400
        try:
            summary = BudgetSummary.create_summary(
                user_id=data['user_id'],
                month=data['month'],
                source_id=data['source_id'],
                summary_type=data['summary_type'],
                total_income=data['total_income'],
                total_expenses=data['total_expenses'],
                balance=data['balance']
            )
            return jsonify(summary), 201
        except mysql.connector.Error as err:
            return jsonify({'error': str(err)}), 500

    @staticmethod
    def get_budget_summary(user_id, month):
        try:
            summaries = BudgetSummary.get_summary_by_user_and_month(user_id, month)
            summaries_list = [{
                'summary_id': summary[0],
                'user_id': summary[1],
                'month': summary[2],
                'source_id': summary[3],
                'summary_type': summary[4],
                'total_income': float(summary[5]),
                'total_expenses': float(summary[6]),
                'balance': float(summary[7])
            } for summary in summaries]
            return jsonify(summaries_list), 200
        except mysql.connector.Error as err:
            return jsonify({'error': str(err)}), 500


    @staticmethod
    def update_budget_summary(budget_id):
        data = request.get_json()
        required_fields = ['summary_id', 'total_income', 'total_expenses', 'balance']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing fields'}), 400
        try:
            BudgetSummary.update_summary(
                summary_id=data['summary_id'],
                total_income=data['total_income'],
                total_expenses=data['total_expenses'],
                balance=data['balance']
            )
            return jsonify({'message': 'Budget summary updated successfully'}), 200
        except mysql.connector.Error as err:
            return jsonify({'error': str(err)}), 500
    
    @staticmethod
    def delete_budget_summary(budget_id):
        data = request.get_json()
        required_fields = ['summary_id']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing fields'}), 400
        try:
            BudgetSummary.delete_summary(
                summary_id=data['summary_id']
            )
            return jsonify({'message': 'Budget summary deleted successfully'}), 200
        except mysql.connector.Error as err:
            return jsonify({'error': str(err)}), 500

    
    @staticmethod
    def get_all_budget_summaries():
        try:
            summaries = BudgetSummary.get_all_summaries()
            summaries_list = [{
                'summary_id': summary[0],
                'user_id': summary[1],
                'month': summary[2],
                'source_id': summary[3],
                'summary_type': summary[4],
                'total_income': float(summary[5]),
                'total_expenses': float(summary[6]),
                'balance': float(summary[7])
            } for summary in summaries]
            return jsonify(summaries_list), 200
        except mysql.connector.Error as err:
            return jsonify({'error': str(err)}), 500