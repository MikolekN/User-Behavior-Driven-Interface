from flask import Flask
from flask_login import LoginManager
from flask_swagger_ui import get_swaggerui_blueprint
from flask_cors import CORS

from database import Database
from helpers import init_bank_account
from routes import authentication_blueprint, transfer_blueprint, user_icon_blueprint, user_blueprint, \
    cyclic_payment_blueprint
from routes.account.account_blueprint import account_blueprint
from users import UserRepository, User


# python -m flask --app .\application.py run

def create_app():
    app = Flask(__name__)

    Database.initialise()

    login_manager = LoginManager(app)
    login_manager.init_app(app)
    @login_manager.user_loader
    def load_user(id: str) -> User | None:
        user_repository = UserRepository()
        return user_repository.find_by_id(id)

    with app.app_context():
        init_bank_account()

    app.register_blueprint(authentication_blueprint)
    app.register_blueprint(transfer_blueprint)
    app.register_blueprint(user_icon_blueprint)
    app.register_blueprint(user_blueprint)
    app.register_blueprint(cyclic_payment_blueprint)
    app.register_blueprint(account_blueprint)

    app.config.from_pyfile('config.py')

    return app

app = create_app()

CORS(app, origins=["http://localhost:5173"], supports_credentials=True)

SWAGGER_URL = '/swagger'
API_URL = '/static/swagger/swagger.json'
swaggerui_blueprint = get_swaggerui_blueprint(
    SWAGGER_URL,
    API_URL,
    config={ 'app_name': "User-Behavior-Driven-Interface Backend API" }
)
app.register_blueprint(swaggerui_blueprint, url_prefix=SWAGGER_URL)

if __name__ == "__main__":
    app.run(debug=app.config['DEBUG_MODE'], host="0.0.0.0")
