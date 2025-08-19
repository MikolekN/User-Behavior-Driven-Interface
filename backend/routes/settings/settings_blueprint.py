

from flask import Blueprint

from routes.settings.update_settings_blueprint import update_settings
from routes.settings.get_settings import get_settings


settings_blueprint = Blueprint('settings', __name__, url_prefix='/api/settings')

settings_blueprint.add_url_rule('/<user_id>', 'get_settings', get_settings, methods=['GET'])
settings_blueprint.add_url_rule('/<user_id>', 'update_settings', update_settings, methods=['PUT'])
