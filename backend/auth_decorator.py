from functools import wraps
from flask import request, jsonify
from controller.UserController import UserController

def require_auth(f):
    """Decorator to require authentication for protected routes"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Get token from Authorization header
        auth_header = request.headers.get('Authorization')
        
        if not auth_header:
            return jsonify({'error': 'Authorization header missing'}), 401
        
        # Check if header starts with 'Bearer '
        if not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Invalid authorization header format. Use: Bearer <token>'}), 401
        
        # Extract token (remove 'Bearer ' prefix)
        token = auth_header.split(' ')[1]
        
        if not token:
            return jsonify({'error': 'Token missing'}), 401
        
        # Verify the token
        payload = UserController.verify_jwt_token(token)
        
        if not payload:
            return jsonify({'error': 'Invalid or expired token'}), 401
        
        request.user_info = payload  # Store the user info in Flask's g object
        
        return f(*args, **kwargs)
    
    return decorated_function

def require_admin(f):
    """Decorator to require admin role for protected routes"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # First check authentication
        auth_header = request.headers.get('Authorization')
        
        if not auth_header:
            return jsonify({'error': 'Authorization header missing'}), 401
        
        if not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Invalid authorization header format. Use: Bearer <token>'}), 401
        
        token = auth_header.split(' ')[1]
        
        if not token:
            return jsonify({'error': 'Token missing'}), 401
        
        # Verify the token
        payload = UserController.verify_jwt_token(token)
        
        if not payload:
            return jsonify({'error': 'Invalid or expired token'}), 401
        
        # Check if user has admin role (role_id = 1)
        if payload.get('role_id') != 1:
            return jsonify({'error': 'Admin access required'}), 403

        request.user_info = payload  # Store the user info in Flask's request object

        return f(*args, **kwargs)
    
    return decorated_function
