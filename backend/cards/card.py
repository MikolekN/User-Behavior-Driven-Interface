import random
from dataclasses import dataclass
from datetime import datetime
from typing import Optional, Dict, Any

import bson

from entity import BaseEntity


@dataclass
class Card(BaseEntity):
    name: Optional[str] = '' # cards name e.g. Credit cards A
    holder_name: Optional[str] = '' # name on the cards e.g. John Smith
    number: Optional[str] = '' # 16-digit card number
    valid_thru: Optional[str] = '' # 'month/year' value
    account: Optional[bson.ObjectId] = None

    @staticmethod
    def from_dict(data: Dict[str, Any]) -> 'Card':
        return Card(
            _id=bson.ObjectId(data['_id']) if '_id' in data else None,
            created=data['created'] if 'created' in data else None,
            name=data.get('name', ''),
            holder_name=data.get('holder_name', ''),
            number=data.get('number', ''),
            valid_thru=data.get('valid_thru', ''),
            account=bson.ObjectId(data['account']) if 'account' in data and data['account'] is not None else None
        )

    def to_dict(self, for_db: bool = False) -> Dict[str, Any]:
        card_dict = super().to_dict(for_db)
        if not for_db:
            card_dict['account'] = str(self.account)
        return card_dict

    def __repr__(self) -> str:
        return (f"Card(_id={self._id!r}, "
                f"created={self.created!r}, "
                f"is_deleted={self.is_deleted!r}, "
                f"name={self.name!r}, "
                f"holder_name={self.holder_name!r}, "
                f"number={self.number!r}, "
                f"valid_thru={self.valid_thru!r}, "
                f"account={self.account!r})")

    @staticmethod
    def generate_card_number() -> str:
        return ''.join(random.choices('0123456789', k=16))

    @staticmethod
    def generate_card_valid_thru() -> str:
        year = datetime.now().year % 100 + 4
        month = datetime.now().month
        return f"{month:02d}/{year}"