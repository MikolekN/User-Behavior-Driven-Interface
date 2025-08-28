from flask import Blueprint

from routes.transfer.analysis_monthly import get_all_user_transfers_monthly
from routes.transfer.analysis_yearly import get_all_user_transfers_yearly
from routes.transfer.loan import create_loan_transfer
from routes.transfer.transfer import create_transfer
from routes.transfer.transfers import get_all_user_transfers

transfer_blueprint = Blueprint('transfer', __name__, url_prefix='/api')

transfer_blueprint.add_url_rule('/transfer', 'create_transfer', create_transfer, methods=['POST'])
transfer_blueprint.add_url_rule('/transfer/loan', 'create_loan_transfer', create_loan_transfer, methods=['POST'])
transfer_blueprint.add_url_rule('/transfers', 'get_all_user_transfers', get_all_user_transfers, methods=['GET'])
transfer_blueprint.add_url_rule('/transfers/analysis/monthly', 'get_all_user_transfers_monthly',
                                get_all_user_transfers_monthly, methods=['POST'])
transfer_blueprint.add_url_rule('/transfers/analysis/yearly', 'get_all_user_transfers_yearly',
                                get_all_user_transfers_yearly, methods=['POST'])
