from flask import Flask
from flask_login import LoginManager
from flask_swagger_ui import get_swaggerui_blueprint
from flask_cors import CORS

from .helpers import init_bank_account
from .database import Database
from .users import *
from .routes import *

# python -m flask --app .\application.py run

def create_app():
    app = Flask(__name__)

    Database.initialise()

    login_manager = LoginManager(app)
    login_manager.init_app(app)
    @login_manager.user_loader
    def load_user(id: str) -> User | None:
        return UserRepository.find_by_id(id)

    with app.app_context():
        init_bank_account()

    app.register_blueprint(authorisation_blueprint)
    app.register_blueprint(transfer_blueprint)
    app.register_blueprint(user_icon_blueprint)
    app.register_blueprint(user_blueprint)
    app.register_blueprint(cyclic_payment_blueprint)

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
