from flask import Blueprint

from routes.authentication.login import login
from routes.authentication.logout import logout
from routes.authentication.register import register

authentication_blueprint = Blueprint('authentication', __name__, url_prefix='/api')

authentication_blueprint.add_url_rule('/login', 'login', login, methods=['POST'])
authentication_blueprint.add_url_rule('/logout', 'logout', logout, methods=['POST'])
authentication_blueprint.add_url_rule('/register', 'register', register, methods=['POST'])
