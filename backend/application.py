from flask import Flask, Response
from database import Database
from users.user import User
from flask_login import LoginManager, login_required
from users.user_repository import UserRepository
from routes.authorisation_blueprint import authorisation_blueprint
from routes.transfer_blueprint import transfer_blueprint
from flask_swagger_ui import get_swaggerui_blueprint
from flask_cors import CORS
# python -m flask --app .\application.py run

app = Flask(__name__)
app.config.from_pyfile('config.py')

CORS(app, origins=["http://localhost:5173"], supports_credentials=True)

SWAGGER_URL = '/swagger'
API_URL = '/static/swagger/swagger.json'
swaggerui_blueprint = get_swaggerui_blueprint(
    SWAGGER_URL,
    API_URL,
    config={ 'app_name': "User-Behavior-Driven-Interface Backend API" }
)
app.register_blueprint(swaggerui_blueprint, url_prefix=SWAGGER_URL)

Database.initialise()

login = LoginManager(app)

@login.user_loader
def load_user(id: str) -> User | None:
    return UserRepository.find_by_id(id)

app.register_blueprint(authorisation_blueprint)
app.register_blueprint(transfer_blueprint)

# temporary placeholder
@app.route("/", methods=['GET'])
@login_required
def hello_world() -> Response:
    return Response("<p>Hello, World!</p>")

if __name__ == "__main__":
    app.run()