from flask import Blueprint

from routes.create_event import create_event
from routes.generate_preferences import generate_preferences
from routes.get_events import get_events
from routes.get_preferences import get_preferences

event_blueprint = Blueprint('event', __name__, url_prefix='/api')

event_blueprint.add_url_rule('/events/<user_id>', 'get_events', get_events, methods=['Get'])
event_blueprint.add_url_rule('/events/create', 'create_event', create_event, methods=['POST'])
event_blueprint.add_url_rule('/preferences/get', 'get_preferences', get_preferences, methods=['POST'])
event_blueprint.add_url_rule('/preferences/generate', 'generate_preferences', generate_preferences, methods=['POST'])
