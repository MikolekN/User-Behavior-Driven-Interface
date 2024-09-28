import bson
from dataclasses import dataclass, field, asdict
from typing import Optional, Dict, Any
from flask_login import UserMixin
from datetime import datetime

@dataclass
class User(UserMixin):
    login: str
    password: str
    _id: Optional[bson.ObjectId] = None
    created: Optional[datetime] = field(default_factory=datetime.now)
    account_name: str = ''
    account_number: str = ''
    blockades: float = ''
    balance: float = ''
    currency: str = ''

    def to_dict(self) -> Dict[str, Any]:
        user_dict = asdict(self)
        if self._id is None:
            user_dict.pop('_id', None)
        else:
            user_dict['_id'] = str(self._id)
        if self.created:
            user_dict['created'] = self.created.isoformat()
        return user_dict

    @staticmethod
    def from_dict(data: Dict[str, Any]) -> 'User':
        return User(
            _id=bson.ObjectId(data['_id']) if '_id' in data else None,
            login=data.get('login', ''),
            password=data.get('password', ''),
            created=datetime.fromisoformat(data['created']) if 'created' in data else None,
            account_name=data.get('account_name', ''),
            account_number=data.get('account_number', ''),
            blockades=data.get('blockades', ''),
            balance=data.get('balance', ''),
            currency=data.get('currency', '')
        )

    def get_id(self) -> str:
        return str(self._id) if self._id else ""
    
    def get_available_funds(self) -> float:
        return float(self.balance) - float(self.blockades)

    def __repr__(self) -> str:
        return (f"User(login={self.login!r}, password={self.password!r}, "
                f"_id={self._id!r}, created={self.created!r}), "
                f"account_name={self.account_name!r}, "
                f"account_number={self.account_number!r}, "
                f"blockades={self.blockades!r}, "
                f"balance={self.balance!r}, "
                f"currency={self.currency!r})")

    def __str__(self) -> str:
        return f"User(login={self.login}, created={self.created})"
