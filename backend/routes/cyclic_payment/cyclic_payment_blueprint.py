from flask import Blueprint

from routes.cyclic_payment.create_cyclic_payment import create_cyclic_payment
from routes.cyclic_payment.delete_cyclic_payment import delete_cyclic_payment
from routes.cyclic_payment.get_cyclic_payment import get_cyclic_payment
from routes.cyclic_payment.get_accounts_cyclic_payments import get_accounts_cyclic_payments
from routes.cyclic_payment.update_cyclic_payment import update_cyclic_payment

cyclic_payment_blueprint = Blueprint('cyclic_payment', __name__, url_prefix='/api')

cyclic_payment_blueprint.add_url_rule('/cyclic-payment', 'create_cyclic_payment', create_cyclic_payment, methods=['POST'])
cyclic_payment_blueprint.add_url_rule('/cyclic-payment/<id>', 'get_cyclic_payment', get_cyclic_payment, methods=['GET'])
cyclic_payment_blueprint.add_url_rule('/cyclic-payment/<id>', 'delete_cyclic_payment', delete_cyclic_payment, methods=['DELETE'])
cyclic_payment_blueprint.add_url_rule('/cyclic-payment/<id>', 'update_cyclic_payment', update_cyclic_payment, methods=['PUT'])
cyclic_payment_blueprint.add_url_rule('/cyclic-payments', 'get_all_user_cyclic_payment', get_accounts_cyclic_payments, methods=['GET'])











