import os
from datetime import timedelta

# JWT Configuration
SECRET_KEY = os.environ.get('SECRET_KEY', 'your_super_secret_key_here_change_in_production')
JWT_EXPIRATION_TIME = int(os.environ.get('JWT_EXPIRATION_TIME', 3600))  # 1 hour in seconds

# Flask Configuration
FLASK_ENV = os.environ.get('FLASK_ENV', 'development')
FLASK_DEBUG = os.environ.get('FLASK_DEBUG', 'True').lower() == 'true'

# MySQL Database Configuration
DB_HOST = os.environ.get('MYSQL_HOST', 'localhost') 
DB_PORT = int(os.environ.get('MYSQL_PORT', 3306))
DB_NAME = os.environ.get('MYSQL_DATABASE', 'budget_db')
DB_USER = os.environ.get('MYSQL_USER', 'root')
DB_PASSWORD = os.environ.get('MYSQL_PASSWORD', '123456')

# JWT Token expiration as timedelta
JWT_EXPIRATION_DELTA = timedelta(seconds=JWT_EXPIRATION_TIME)

# SMTP Configuration
SMTP_HOST = os.environ.get('SMTP_HOST', 'smtp.gmail.com')
SMTP_PORT = int(os.environ.get('SMTP_PORT', 587))
SMTP_USER = os.environ.get('SMTP_USER', 'neomi150992@gmail.com')
SMTP_PASSWORD = os.environ.get('SMTP_PASSWORD', 'ltdm bewn ctnf yjpb')  




