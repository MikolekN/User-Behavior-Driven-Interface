from flask import Flask, request, jsonify
import bson
from database import Database
from users.user import User
from flask_login import LoginManager, current_user, login_user, logout_user, login_required
import bcrypt
from datetime import datetime
# python -m flask --app .\application.py run

app = Flask(__name__)
app.config['SECRET_KEY'] = 'you-will-never-guess'
Database.initialise()
login = LoginManager(app)

@login.user_loader
def load_user(id):
    query = {'_id': bson.ObjectId(id)}
    return User.from_dict(Database.find_one('Users', query))

@app.route("/")
@login_required
def hello_world():
    return "<p>Hello, World!</p>"

@app.route('/login', methods=['POST'])
def login():
    if current_user.is_authenticated:
        return jsonify(message="Already logged in"), 409
    data = request.get_json()
    if not data or 'login' not in data or 'password' not in data:
        return jsonify(message="Invalid request payload"), 400
    query = {'login': data['login']}
    user_dict = Database.find_one('Users', query)
    if user_dict is None:
        return jsonify(message="User does not exist"), 404
    user = User.from_dict(user_dict)
    if not bcrypt.checkpw(data['password'].encode('utf-8'), user.password.encode('utf-8')):
        return jsonify(status="error", message="Wrong password"), 401
    login_user(user)
    user_dict.pop('password', None)
    user_dict['_id'] = str(user_dict['_id'])
    return jsonify(message="Logged in successfully", user=user_dict), 200

@app.route('/logout')
def logout():
    if not current_user.is_authenticated:
        return jsonify(message="No user logged in"), 409
    logout_user()
    return jsonify(message="Logged out successfully"), 200

@app.route('/register', methods=['POST'])
def register():
    if current_user.is_authenticated:
        return jsonify(message="Already logged in"), 409
    data = request.get_json()
    if not data or 'login' not in data or 'password' not in data:
        return jsonify(message="Invalid request payload"), 400
    query = {'login': data['login']}
    user_dict = Database.find_one('Users', query)
    if user_dict:
        return jsonify(message="User already exists"), 409
    hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    user = User(data['login'], hashed_password, created=datetime.now())
    inserted_user = Database.insert_one('Users', user.to_dict())
    inserted_user_id = inserted_user.inserted_id
    fetched_user_dict = Database.find_one('Users', {'_id': inserted_user_id})
    if not fetched_user_dict:
        return jsonify(message="Error fetching the newly created user"), 500
    fetched_user_dict.pop('password', None)
    fetched_user_dict['_id'] = str(fetched_user_dict['_id'])
    return jsonify(message="User registered successfully", user=fetched_user_dict), 201
