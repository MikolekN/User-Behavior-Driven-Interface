import bson
from dataclasses import dataclass, field, asdict
from typing import Optional, Dict, Any
from datetime import datetime

from entity import BaseEntity

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
    account_name: Optional[str] = ''
    account_number: Optional[str] = ''
    type: Optional[str] = ''
    blockades: Optional[float] = ''
    balance: Optional[float] = ''
    currency: Optional[str] = ''
    user: Optional[bson.ObjectId] = None
    
    @staticmethod
    def from_dict(data: Dict[str, Any]) -> 'Account':
        return Account(
            _id=bson.ObjectId(data['_id']) if '_id' in data else None,
            created=datetime.fromisoformat(data['created']) if 'created' in data else None,
            account_name=data.get('account_name', ''),
            account_number=data.get('account_number', ''),
            type=data.get('type', 'other'),
            blockades=data.get('blockades', 0),
            balance=data.get('balance', 0),
            user=bson.ObjectId(data['user']) if 'user' in data else None,
        )

    def to_dict(self) -> Dict[str, Any]:
        account_dict = super().to_dict()
        account_dict.pop('user', None)
        return account_dict

    def get_available_funds(self) -> float:
        return float(self.balance) - float(self.blockades)

    def __repr__(self) -> str:
        return (f"Account(_id={self._id!r}, "
                f"created={self.created!r}, "
                f"account_name={self.account_name!r}, "
                f"account_number={self.account_number!r}, "
                f"type={self.type!r}, "
                f"blockades='{self.blockades!r}', "
                f"balance={self.balance!r}', "
                f"currency={self.currency!r})")
