import mysql.connector
from env_config import DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT
import os
from werkzeug.security import generate_password_hash


        
class Users:
    @staticmethod
    def get_db_connection():
        return mysql.connector.connect(
            host=DB_HOST,
            port=DB_PORT,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD
        )
       
    @staticmethod
    def reset_all_passwords_to_default(default_password="1234"):
        from werkzeug.security import generate_password_hash
        hashed = generate_password_hash(default_password)
        with Users.get_db_connection() as connection:
            cursor = connection.cursor()
            cursor.execute("UPDATE users SET password=%s", (hashed,))
            connection.commit()
            cursor.close()
    
    @staticmethod
    def alter_password_column():
        with Users.get_db_connection() as connection:
            cursor = connection.cursor()
            sql = "ALTER TABLE users MODIFY password VARCHAR(255) NOT NULL;"
            cursor.execute(sql)
            connection.commit()
            cursor.close()
    
    
    @staticmethod
    def create_table():
        with Users.get_db_connection() as connection:
            cursor = connection.cursor()
            sql = '''CREATE TABLE IF NOT EXISTS users (
                    user_id INT AUTO_INCREMENT PRIMARY KEY,
                    first_name VARCHAR(100) NOT NULL,
                    last_name VARCHAR(100) NOT NULL,
                    email VARCHAR(100) NOT NULL,
                    password VARCHAR(100) NOT NULL,
                    role_id INT NOT NULL,
                    profile_image_url VARCHAR(255),
                    FOREIGN KEY (role_id) REFERENCES roles(role_id)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4'''
            cursor.execute(sql)
            cursor.close()
    
    @staticmethod
    def create_user(first_name, last_name, email, password, profile_image_url=None):
        hashed_password = generate_password_hash(password)
        with Users.get_db_connection() as connection:
            cursor = connection.cursor()
            cursor.execute('SELECT * FROM users WHERE email=%s', (email,))
            is_exist = cursor.fetchone()
            if is_exist:
                return None
            query = "INSERT INTO users (first_name, last_name, email, password, role_id, profile_image_url) VALUES (%s, %s, %s, %s, %s, %s)"
            cursor.execute(query, (first_name, last_name, email, hashed_password, 2, profile_image_url))  # Default role_id = 2
            connection.commit()
            cursor.close()
            return {
                "user_id": cursor.lastrowid,
                "first_name": first_name,
                "last_name": last_name,
                "email": email,
                "profile_image_url": profile_image_url
            }

    @staticmethod
    def get_all_users():
        with Users.get_db_connection() as connection:
            cursor = connection.cursor()
            query = "SELECT * FROM users"
            cursor.execute(query)
            users = cursor.fetchall()
            return users

    @staticmethod
    def get_user_by_id(user_id):
        with Users.get_db_connection() as connection:
            cursor = connection.cursor()
            query = "SELECT * FROM users WHERE user_id = %s"
            cursor.execute(query, (user_id,))
            user = cursor.fetchone()
            return user

    @staticmethod
    def update_user(user_id, first_name, last_name, email, profile_image_url=None):
        with Users.get_db_connection() as connection:
            cursor = connection.cursor()
            query = "UPDATE users SET first_name = %s, last_name = %s, email = %s, profile_image_url = %s WHERE user_id = %s"
            cursor.execute(query, (first_name, last_name, email, profile_image_url, user_id))
            connection.commit()
            rows_affected = cursor.rowcount
            cursor.close()
            return rows_affected

    @staticmethod
    def delete_user(user_id):
        with Users.get_db_connection() as connection:
            cursor = connection.cursor()
            query = "DELETE FROM users WHERE user_id = %s"
            cursor.execute(query, (user_id,))
            connection.commit()
            cursor.close()

    @staticmethod
    def login_user(email, password):
        with Users.get_db_connection() as connection:
            cursor = connection.cursor()
            query = "SELECT * FROM users WHERE email = %s AND password = %s"
            cursor.execute(query, (email, password))
            user = cursor.fetchone()
            cursor.close()
            return user

    @staticmethod
    def get_user_by_email(email):
        with Users.get_db_connection() as connection:
            cursor = connection.cursor()
            query = "SELECT * FROM users WHERE email = %s"
            cursor.execute(query, (email,))
            user = cursor.fetchone()
            cursor.close()
            return user

    @staticmethod
    def update_password(user_id, new_password):
        with Users.get_db_connection() as connection:
            cursor = connection.cursor()
            query = "UPDATE users SET password = %s WHERE user_id = %s"
            cursor.execute(query, (new_password, user_id))
            connection.commit()
            updated_rows = cursor.rowcount
            cursor.close()
            return updated_rows

    @staticmethod
    def update_profile_image(user_id, profile_image_url):
            with Users.get_db_connection() as connection:
                cursor = connection.cursor()
                query = "UPDATE users SET profile_image_url = %s WHERE user_id = %s"
                cursor.execute(query, (profile_image_url, user_id))
                connection.commit()
                rows_affected = cursor.rowcount
                cursor.close()
                return rows_affected


    @staticmethod
    def profile_image_exists(filename):
        image_folder = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'profile_images_uploads')
        file_path = os.path.join(image_folder, filename)
        return os.path.exists(file_path)