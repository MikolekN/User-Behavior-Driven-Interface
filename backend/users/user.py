from dataclasses import dataclass
from typing import Optional, Dict, Any

import bson
from flask_login import UserMixin
from shared import BaseEntity


@dataclass
class User(BaseEntity, UserMixin):
    login: Optional[str] = ''
    email: Optional[str] = ''
    password: Optional[str] = ''
    active_account: Optional[bson.ObjectId] = None
    user_icon: Optional[str] = None
    role: Optional[str] = ''

    def to_dict(self, for_db: bool = False) -> Dict[str, Any]:
        user_dict = super().to_dict(for_db)
        if self.active_account:
            user_dict['active_account'] = self.active_account if for_db else str(self.active_account)
        if not for_db:
            user_dict.pop('password', None)
            user_dict.pop('user_icon', None)
        return user_dict

    @staticmethod
    def from_dict(data: Dict[str, Any]) -> 'User':
        return User(
            _id=bson.ObjectId(data['_id']) if '_id' in data else None,
            created=data.get('created', None),
            login=data.get('login', ''),
            email=data.get('email', ''),
            password=data.get('password', ''),
            active_account=bson.ObjectId(data['active_account']) if data.get('active_account', None) else None,
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
