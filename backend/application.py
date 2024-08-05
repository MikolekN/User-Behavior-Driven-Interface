from flask import Flask
from database import Database
from users.user import User
from flask_login import LoginManager, login_required
from users.user_repository import UserRepository
from routes.authorisation_blueprint import authorisation_blueprint
# python -m flask --app .\application.py run

app = Flask(__name__)
app.config.from_pyfile('config.py')
Database.initialise()
login = LoginManager(app)

@login.user_loader
def load_user(id):
    return UserRepository.find_by_id(id)

app.register_blueprint(authorisation_blueprint)

# temporary placeholder
@app.route("/")
@login_required
def hello_world():
    return "<p>Hello, World!</p>"
