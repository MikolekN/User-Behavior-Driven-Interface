from flask import Blueprint

from routes.event.create_event.create_event import create_event

event_blueprint = Blueprint('events', __name__, url_prefix='/api/events')

event_blueprint.add_url_rule('/<user_id>', 'create_event', create_event, methods=['POST'])
