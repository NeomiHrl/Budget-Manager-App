
from models.UserModel import Users
from flask import jsonify, request
import re
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from datetime import datetime, timedelta
import mysql.connector
import smtplib
from email.mime.text import MIMEText
from env_config import SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD


class UserController:

    @staticmethod
    def create_jwt_token(user_data):
        """Create JWT token for user"""
        try:
            # Get secret key from environment or use default
            secret_key = 'your_super_secret_key_here_change_in_production_12345'
            
            # Token payload
            payload = {
                'user_id': user_data['user_id'],
                'email': user_data['email'],
                'role_id': user_data['role_id'],
                'exp': datetime.utcnow() + timedelta(minutes=60),  # 60 minutes expiration
                'iat': datetime.utcnow()
            }
            
            # Create token
            token = jwt.encode(payload, secret_key, algorithm='HS256')
            return token
        except Exception as e:
            print(f"Error creating JWT token: {e}")
            return None

    @staticmethod
    def verify_jwt_token(token):
        """Verify JWT token and return payload"""
        try:
            secret_key = 'your_super_secret_key_here_change_in_production_12345'
            payload = jwt.decode(token, secret_key, algorithms=['HS256'])
            return payload
        except jwt.ExpiredSignatureError:
            return None  # Token expired
        except jwt.InvalidTokenError:
            return None  # Invalid token
        except Exception as e:
            print(f"Error verifying JWT token: {e}")
            return None

    @staticmethod
    def create_user():
        try:
            data = request.get_json()
            first_name = data.get('first_name')
            last_name = data.get('last_name')
            email = data.get('email')
            password = data.get('password')
            if not all([first_name, last_name, email, password]):
                return jsonify({'message': 'כל השדות חובה'}), 400
            if len(password) < 4:
                return jsonify({'message': 'הסיסמה חייבת להיות לפחות 4 תווים'}), 400
            result = Users.create_user(first_name, last_name, email, password)
            if result is None:
                return jsonify({'message': 'המשתמש קיים כבר'}), 409
            return jsonify(result), 201
        except mysql.connector.Error as err:
            return jsonify({'error': str(err)}), 500

    @staticmethod
    def get_users():
        try:
            users = Users.get_all_users()
            users_list = [{'user_id': user[0], 'first_name': user[1], 'last_name': user[2], 'email': user[3]} for user in users]
            return jsonify(users_list), 200
        except mysql.connector.Error as err:
            return jsonify({'error': str(err)}), 500

    @staticmethod
    def get_user_by_id(user_id):
        try:
            user = Users.get_user_by_id(user_id)
            if user:
                user_data = {'user_id': user[0], 'first_name': user[1], 'last_name': user[2], 'email': user[3]}
                return jsonify(user_data), 200
            else:
                return jsonify({'message': 'משתמש לא נמצא'}), 404
        except mysql.connector.Error as err:
            return jsonify({'error': str(err)}), 500

    @staticmethod
    def update_user(user_id):
        try:
            data = request.get_json()
            first_name = data.get('first_name')
            last_name = data.get('last_name')
            email = data.get('email')
            password = data.get('password')
            if not all([first_name, last_name, email, password]):
                return jsonify({'message': 'כל השדות חובה'}), 400
            rows_affected = Users.update_user(user_id, first_name, last_name, email, password)
            if rows_affected:
                return jsonify({'user_id': user_id, 'first_name': first_name, 'last_name': last_name, 'email': email}), 200
            else:
                return jsonify({'message': 'משתמש לא נמצא'}), 404
        except mysql.connector.Error as err:
            return jsonify({'error': str(err)}), 500

    @staticmethod
    def delete_user(user_id):
        try:
            rows_affected = Users.delete_user(user_id)
            if rows_affected:
                return jsonify({'message': 'המשתמש נמחק בהצלחה'}), 200
            else:
                return jsonify({'message': 'משתמש לא נמצא'}), 404
        except mysql.connector.Error as err:
            return jsonify({'error': str(err)}), 500
    
    @staticmethod
    def login_user():
        try:
            data = request.get_json()
            email = data.get('email')
            password = data.get('password')
            if not all([email, password]):
                return jsonify({'message': 'אימייל וסיסמה נדרשים'}), 400
            user = Users.get_user_by_email(email)
            if not user:
                return jsonify({'error': 'User not found'}), 404
            if not check_password_hash(user[4], password):
               return jsonify({'error': 'Incorrect password'}), 401
            user_data = {
                'user_id': user[0],
                'email': user[3],
                'role_id': user[5]
            }
            token = UserController.create_jwt_token(user_data)
            if token:
                return jsonify({
                    'message': 'Login successful!',
                    'user_id': user[0],
                    'first_name': user[1],
                    'last_name': user[2],
                    'email': user[3],
                    'role_id': user[5],
                    'token': token
                }), 200
            else:
                return jsonify({'error': 'Failed to create JWT token'}), 500
        except mysql.connector.Error as err:
            return jsonify({'error': str(err)}), 500

    
    @staticmethod
    def update_password(user_id, new_password):
        try:
            hashed_password = generate_password_hash(new_password)
            rows_affected = Users.update_password(user_id, hashed_password)
            return rows_affected > 0
        except mysql.connector.Error as err:
            print(f"Error updating password: {err}")
            return False

    @staticmethod
    def get_user_by_email(email):
        try:
            user = Users.get_user_by_email(email)
            return user
        except mysql.connector.Error as err:
            print(f"Error fetching user by email: {err}")
            return None

    @staticmethod
    def forgot_password():
        data = request.get_json()
        email = data.get('email')
        if not email:
            return jsonify({'message': 'יש להזין אימייל'}), 400
        user = UserController.get_user_by_email(email)
        if not user:
            return jsonify({'message': 'אימייל לא נמצא, נא לבצע הרשמה'}), 404
        # user הוא tuple: (user_id, first_name, last_name, email, password, role_id)
        secret_key = 'your_super_secret_key_here_change_in_production_12345'
        payload = {
            'user_id': user[0],
            'exp': datetime.utcnow() + timedelta(minutes=30)
        }
        token = jwt.encode(payload, secret_key, algorithm='HS256')
        reset_link = f"http://localhost:5173/reset-password?token={token}"
        msg = MIMEText(f"לחץ על הקישור לאיפוס סיסמה: {reset_link}")
        msg['Subject'] = 'איפוס סיסמה'
        msg['From'] = 'noreply@yourapp.com'
        msg['To'] = email
        try:
            with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
                server.starttls()
                server.login(SMTP_USER, SMTP_PASSWORD)
                server.sendmail(SMTP_USER, [email], msg.as_string())
            return jsonify({'message': 'קישור איפוס נשלח לאימייל שלך'}), 200
        except Exception as e:
            return jsonify({'message': f'שגיאה בשליחת מייל: {e}'}), 500

    
    @staticmethod
    def reset_password():
        data = request.get_json()
        token = data.get('token')
        new_password = data.get('new_password')
        if not all([token, new_password]):
            return jsonify({'message': 'חסר טוקן או סיסמה חדשה'}), 400
        secret_key = 'your_super_secret_key_here_change_in_production_12345'
        try:
            payload = jwt.decode(token, secret_key, algorithms=['HS256'])
            user_id = payload['user_id']
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'הטוקן פג תוקף'}), 400
        except Exception as e:
            return jsonify({'message': f'טוקן לא תקין: {e}'}), 400
        updated = UserController.update_password(user_id, new_password)
        print("user_id:", user_id)
        print("new_password:", new_password)
        if updated:
            return jsonify({'message': 'הסיסמה אופסה בהצלחה'}), 200
        else:
            return jsonify({'message': 'שגיאה בעדכון הסיסמה'}), 500