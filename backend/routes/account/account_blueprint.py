from flask import Blueprint

from routes.account.create_account import create_account
from routes.account.delete_account import delete_account
from routes.account.get_account import get_account
from routes.account.get_accounts import get_accounts
from routes.account.get_active_account import get_active_account
from routes.account.set_active_account import set_active_account
from routes.account.update_account import update_account

account_blueprint = Blueprint('account', __name__, url_prefix='/api')

account_blueprint.add_url_rule('/accounts/active', 'get_active_account', get_active_account, methods=['GET'])
account_blueprint.add_url_rule('/accounts/<account_number>', 'get_account', get_account, methods=['GET'])
account_blueprint.add_url_rule('/accounts/', 'get_accounts', get_accounts, methods=['GET'])
account_blueprint.add_url_rule('/accounts/set_active/<account_number>', 'set_active_account', set_active_account, methods=['PUT'])
account_blueprint.add_url_rule('/accounts/', 'create_account', create_account, methods=['POST'])
account_blueprint.add_url_rule('/accounts/<account_number>', 'update_account', update_account, methods=['PUT'])
account_blueprint.add_url_rule('/accounts/<account_number>', 'delete_account', delete_account, methods=['DELETE'])

