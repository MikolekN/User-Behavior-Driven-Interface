from flask import Blueprint

from routes.card.create_card import create_card
from routes.card.delete_card import delete_card
from routes.card.get_card import get_card
from routes.card.get_cards import get_cards
from routes.card.update_card import update_card

card_blueprint = Blueprint('card', __name__, url_prefix='/api')

card_blueprint.add_url_rule('/cards', 'create_card', create_card, methods=['POST'])
card_blueprint.add_url_rule('/cards/<card_number>', 'get_card', get_card, methods=['GET'])
card_blueprint.add_url_rule('/cards', 'get_cards', get_cards, methods=['GET'])
card_blueprint.add_url_rule('/cards/<card_number>', 'delete_card', delete_card, methods=['DELETE'])
card_blueprint.add_url_rule('/cards/<card_number>', 'update_card', update_card, methods=['PUT'])
