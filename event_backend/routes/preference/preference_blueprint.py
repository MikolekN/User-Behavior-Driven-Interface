from flask import Blueprint

from routes.preference.generate_preferences import generate_preferences
from routes.preference.get_preferences import get_preferences

preference_blueprint = Blueprint('preferences', __name__, url_prefix='/api/preferences')

preference_blueprint.add_url_rule('/<user_id>', 'get_preferences', get_preferences, methods=['GET'])
preference_blueprint.add_url_rule('/<user_id>', 'generate_preferences', generate_preferences, methods=['POST'])
