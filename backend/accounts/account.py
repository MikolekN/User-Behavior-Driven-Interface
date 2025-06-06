import random
from dataclasses import dataclass
from datetime import datetime
from typing import Optional, Dict, Any

import bson
from shared import BaseEntity

account_types = [
    'personal',
    'savings',
    'currency',
    'business',
    'youth',
    'student',
    'retirement',
    'BANK',
    'other'
]

@dataclass
class Account(BaseEntity):
    name: Optional[str] = ''
    number: Optional[str] = ''
    type: Optional[str] = ''
    blockades: Optional[float] = ''
    balance: Optional[float] = ''
    currency: Optional[str] = ''
    user: Optional[bson.ObjectId] = None

    @staticmethod
    def generate_account_number() -> str:
        return ''.join(random.choices('0123456789', k=26))

    @staticmethod
    def from_dict(data: Dict[str, Any]) -> 'Account':
        return Account(
            _id=bson.ObjectId(data['_id']) if '_id' in data else None,
            created=data['created'] if 'created' in data else None,
            name=data.get('name', ''),
            number=data.get('number', Account.generate_account_number()),
            type=data.get('type', 'other'),
            blockades=data.get('blockades', 0),
            balance=data.get('balance', 0),
            currency=data.get('currency', data['currency']),
            user=bson.ObjectId(data['user']) if 'user' in data and data['user'] is not None else None
        )

    def to_dict(self, for_db: bool = False) -> Dict[str, Any]:
        account_dict = super().to_dict(for_db)
        if not for_db:
            account_dict['user'] = str(self.user)
        return account_dict

    def get_available_funds(self) -> float:
        return float(self.balance) - float(self.blockades)

    def __repr__(self) -> str:
        return (f"Account(_id={self._id!r}, "
                f"created={self.created!r}, "
                f"name={self.name!r}, "
                f"number={self.number!r}, "
                f"type={self.type!r}, "
                f"blockades='{self.blockades!r}', "
                f"balance={self.balance!r}', "
                f"currency={self.currency!r}', "
                f"user={self.user!r})")
