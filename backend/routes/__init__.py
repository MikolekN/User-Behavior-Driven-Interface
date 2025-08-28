from routes.account.account_blueprint import account_blueprint
from routes.authentication.authentication_blueprint import authentication_blueprint
from routes.cyclic_payment.cyclic_payment_blueprint import cyclic_payment_blueprint
from routes.settings.settings_blueprint import settings_blueprint
from routes.transfer.transfer_blueprint import transfer_blueprint
from routes.user.user_blueprint import user_blueprint

__all__ = ['authentication_blueprint', 'user_blueprint', 'transfer_blueprint', 'cyclic_payment_blueprint',
           'account_blueprint', 'settings_blueprint']
