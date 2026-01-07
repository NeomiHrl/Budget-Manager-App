import mysql.connector
from env_config import DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT
import os

class Roles:
    
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
    def create_table():
        with Roles.get_db_connection() as connection:
            cursor = connection.cursor()
            sql = '''CREATE TABLE IF NOT EXISTS roles (
                    role_id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(100) NOT NULL
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4'''
            cursor.execute(sql)
            cursor.close()

            
    @staticmethod
    def create_role(name):
        with Roles.get_db_connection() as connection:
            cursor = connection.cursor()
            cursor.execute('SELECT * FROM roles WHERE name=%s', (name,))
            is_exist = cursor.fetchone()
            if is_exist:
                return None
            query = "INSERT INTO roles (name) VALUES (%s)"
            cursor.execute(query, (name,))
            connection.commit()
            cursor.close()
            return {
                "role_id": cursor.lastrowid,
                "name": name
            }

    @staticmethod
    def get_all_roles():
        with Roles.get_db_connection() as connection:
            cursor = connection.cursor()
            query = "SELECT * FROM roles"
            cursor.execute(query)
            roles = cursor.fetchall()
            return roles

    @staticmethod
    def get_role_by_id(role_id):
        with Roles.get_db_connection() as connection:
            cursor = connection.cursor()
            query = "SELECT * FROM roles WHERE id = %s"
            cursor.execute(query, (role_id,))
            role = cursor.fetchone()
            return role

    

    @staticmethod
    def update_role(role_id, name):
        with Roles.get_db_connection() as connection:
            cursor = connection.cursor()
            query = "UPDATE roles SET name = %s WHERE role_id = %s"
            cursor.execute(query, (name, role_id))
            connection.commit()
            return cursor.rowcount

    @staticmethod
    def delete_role(role_id):
        with Roles.get_db_connection() as connection:
            cursor = connection.cursor()
            query = "DELETE FROM roles WHERE role_id = %s"
            cursor.execute(query, (role_id,))
            connection.commit()
            return cursor.rowcount

