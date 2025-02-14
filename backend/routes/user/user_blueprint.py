from flask import Blueprint

from routes.user.delete_user import delete_user
from routes.user.get_user import get_user
from routes.user.get_user_icon import get_user_icon
from routes.user.update_user import update_user
from routes.user.upload_user_icon import upload_user_icon

user_blueprint = Blueprint('user_update', __name__, url_prefix='/api')

user_blueprint.add_url_rule('/user', 'get_user', get_user, methods=['GET'])
user_blueprint.add_url_rule('/user/update', 'update_user', update_user, methods=['PATCH'])
user_blueprint.add_url_rule('/user/icon', 'get_user_icon', get_user_icon, methods=['GET'])
user_blueprint.add_url_rule('/user/icon', 'upload_user_icon', upload_user_icon, methods=['POST'])
user_blueprint.add_url_rule('/user', 'delete_user', delete_user, methods=['DELETE'])
