from dataclasses import dataclass
from datetime import datetime
from typing import Optional, Dict, Any

import bson
from flask_login import UserMixin

from entity import BaseEntity


@dataclass
class User(BaseEntity, UserMixin):
    login: Optional[str] = ''
    email: Optional[str] = ''
    password: Optional[str] = ''
    active_account: Optional[bson.ObjectId] = None
    role: Optional[str] = ''
    user_icon: Optional[str] = None

    def to_dict(self) -> Dict[str, Any]:
        user_dict = super().to_dict()
        if self.user_icon is None:
            user_dict.pop('user_icon', None)
        return user_dict

    @staticmethod
    def from_dict(data: Dict[str, Any]) -> 'User':
        return User(
            _id=bson.ObjectId(data['_id']) if '_id' in data else None,
            created=datetime.fromisoformat(data['created']) if 'created' in data else None,
            login=data.get('login', ''),
            email=data.get('email', ''),
            password=data.get('password', ''),
            active_account=bson.ObjectId(data['active_account']) if 'active_account' in data else None,
            user_icon=data.get('user_icon', None),
            role=data.get('role', '')
        )


    def __repr__(self) -> str:
        return (f"User(login={self.login!r}, "
                f"email={self.email!r}, "
                f"password={self.password!r}, "
                f"_id={self._id!r}, "
                f"created={self.created!r}, "
                f"active_account={str(self.active_account)!r}, "
                f"user_icon={self.user_icon!r}, "
                f"role={self.role!r})")
