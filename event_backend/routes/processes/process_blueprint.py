from flask import Blueprint

from routes.processes.generate_process_model import generate_process_model
from routes.processes.get_next_step import get_next_step
from routes.processes.run_process_instance import run_process_instance

process_blueprint = Blueprint('processes', __name__, url_prefix='/api/processes')

process_blueprint.add_url_rule('/<user_id>', 'run_process_instance', run_process_instance, methods=['POST'])
process_blueprint.add_url_rule('/<user_id>', 'get_next_step', get_next_step, methods=['GET'])
process_blueprint.add_url_rule('/generate/<user_id>', 'generate_process_model', generate_process_model,
                               methods=['POST'])
