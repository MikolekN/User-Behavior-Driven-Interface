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

    def to_dict(self) -> Dict[str, Any]:
        # Converts the User instance to a dictionary suitable for MongoDB insertion.
        user_dict = asdict(self)
        if self._id is None:
            user_dict.pop('_id', None)  # Remove _id field if it is None, MongoDB will generate it
        else:
            user_dict['_id'] = str(self._id)  # Convert ObjectId to string
        if self.created:
            user_dict['created'] = self.created.isoformat()  # Convert datetime to ISO format string
        return user_dict

    @staticmethod
    def from_dict(data: Dict[str, Any]) -> 'User':
        # Creates a User instance from a MongoDB document.
        return User(
            _id=bson.ObjectId(data['_id']) if '_id' in data else None,
            login=data.get('login', ''),
            password=data.get('password', ''),
            created=datetime.fromisoformat(data['created']) if 'created' in data else None
        )

    def get_id(self) -> str:
        # Returns the string representation of _id.
        return str(self._id) if self._id else ""

    def __repr__(self) -> str:
       # Returns a string representation of the User instance for debugging.
        return (f"User(login={self.login!r}, password={self.password!r}, "
                f"_id={self._id!r}, created={self.created!r})")

    def __str__(self) -> str:
        # Returns a user-friendly string representation of the User instance.
        return f"User(login={self.login}, created={self.created})"
