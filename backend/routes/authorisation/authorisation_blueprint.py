from flask import Blueprint

from routes.authorisation.login import login
from routes.authorisation.logout import logout
from routes.authorisation.register import register

authorisation_blueprint = Blueprint('authorisation', __name__, url_prefix='/api')

authorisation_blueprint.add_url_rule('/login', 'login', login, methods=['POST'])
authorisation_blueprint.add_url_rule('/logout', 'logout', logout, methods=['POST'])
authorisation_blueprint.add_url_rule('/register', 'register', register, methods=['POST'])
