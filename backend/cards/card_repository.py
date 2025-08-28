from typing import Type, Optional

import bson
from shared import BaseRepository

from cards import Card


class CardRepository(BaseRepository):
    COLLECTION: str = 'Cards'

    def __init__(self):
        super().__init__(self.COLLECTION)

    def _entity_class(self) -> Type[Card]:
        return Card

    def find_by_card_number(self, card_number: str) -> Optional[Card]:
        return super().find_by_field('number', card_number)

    def find_cards(self, id: str) -> list[Card]:
        query = {
            'account': bson.ObjectId(id)
        }
        sort_criteria = [("created", -1)]
        return super().find_many(query, sort_criteria)
