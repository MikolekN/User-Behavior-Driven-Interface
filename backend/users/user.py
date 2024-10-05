import bson
from dataclasses import dataclass, field, asdict
from typing import Optional, Dict, Any
from flask_login import UserMixin
from datetime import datetime

@dataclass
class User(UserMixin):
    login: str
    email: str
    password: str
    account_name: str
    account_number: str
    blockades: float
    balance: float
    currency: str
    user_icon: str | None
    role: str
    _id: Optional[bson.ObjectId] = None
    created: Optional[datetime] = field(default_factory=datetime.now)


    def to_dict(self) -> Dict[str, Any]:
        user_dict = asdict(self)
        if self._id is None:
            user_dict.pop('_id', None)
        else:
            user_dict['_id'] = str(self._id)
        if self.created:
            user_dict['created'] = self.created.isoformat()
        if self.user_icon is None:
            user_dict.pop('user_icon', None)
        return user_dict

    @staticmethod
    def from_dict(data: Dict[str, Any]) -> 'User':
        return User(
            _id=bson.ObjectId(data['_id']) if '_id' in data else None,
            login=data.get('login', ''),
            email=data.get('email', ''),
            password=data.get('password', ''),
            created=datetime.fromisoformat(data['created']) if 'created' in data else None,
            account_name=data.get('account_name', ''),
            account_number=data.get('account_number', ''),
            blockades=data.get('blockades', ''),
            balance=data.get('balance', ''),
            currency=data.get('currency', ''),
            user_icon=data.get('user_icon', None),
            role=data.get('role', '')
        )

    def get_id(self) -> str:
        return str(self._id) if self._id else ""
    
    def get_available_funds(self) -> float:
        return float(self.balance) - float(self.blockades)

    def __repr__(self) -> str:
       # Returns a string representation of the User instance for debugging.
        return (f"User(login={self.login!r}, "
                f"email={self.email!r}, "
                f"password={self.password!r}, "
                f"_id={self._id!r}, "
                f"created={self.created!r}, "
                f"account_name={self.account_name!r}, "
                f"account_number={self.account_number!r}, "
                f"blockades={self.blockades!r}, "
                f"balance={self.balance!r}, "
                f"currency={self.currency!r}, "
                f"user_icon={self.user_icon!r}, "
                f"role={self.role!r})")

    def __str__(self) -> str:
        # Returns a user-friendly string representation of the User instance.
        return f"User(email={self.email}, created={self.created})"
    
    def sanitize_user_dict(self) -> dict[str, Any]:
        user_dict = self.to_dict()
        user_dict.pop('password', None)
        user_dict.pop('user_icon', None)
        user_dict.pop('_id', None)
        user_dict.pop('created', None)
        return user_dict
