from flask import Blueprint, request, jsonify
from flask_login import current_user, login_user, logout_user
import bcrypt
from datetime import datetime
from users.user_repository import UserRepository
from users.user import User

authorisation_blueprint = Blueprint('authorisation', __name__, url_prefix='/api')

@authorisation_blueprint.route('/login', methods=['POST'])
def login():
    if current_user.is_authenticated:
        return jsonify(message="Already logged in"), 409
    data = request.get_json()
    if not data or 'login' not in data or 'password' not in data:
        return jsonify(message="Invalid request payload"), 400
    user = UserRepository.find_by_login(data['login'])
    if user is None:
        return jsonify(message="User does not exist"), 404
    if not bcrypt.checkpw(data['password'].encode('utf-8'), user.password.encode('utf-8')):
        return jsonify(status="error", message="Wrong password"), 401
    login_user(user)
    user_dict = user.to_dict()
    user_dict.pop('password', None)
    user_dict['_id'] = str(user_dict['_id'])
    return jsonify(message="Logged in successfully", user=user_dict), 200

@authorisation_blueprint.route('/logout')
def logout():
    if not current_user.is_authenticated:
        return jsonify(message="No user logged in"), 409
    logout_user()
    return jsonify(message="Logged out successfully"), 200

@authorisation_blueprint.route('/register', methods=['POST'])
def register():
    if current_user.is_authenticated:
        return jsonify(message="Already logged in"), 409
    data = request.get_json()
    if not data or 'login' not in data or 'password' not in data:
        return jsonify(message="Invalid request payload"), 400
    if UserRepository.find_by_login(data['login']):
        return jsonify(message="User already exists"), 409
    hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    user = User(data['login'], hashed_password, created=datetime.now())
    user = UserRepository.insert(user)
    user_dict = user.to_dict()
    user_dict.pop('password', None)
    user_dict['_id'] = str(user_dict['_id'])
    return jsonify(message="User registered successfully", user=user_dict), 201
