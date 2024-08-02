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
    created: Optional[datetime] = field(default_factory=datetime.now())

    def to_dict(self) -> Dict[str, Any]:
        # Convert User instance to a dictionary for MongoDB insertion.
        user_dict = asdict(self)
        if self._id is None:
            del user_dict['_id']  # Remove _id field if it is None, MongoDB will generate it
        else:
            user_dict['_id'] = str(self._id)  # Convert ObjectId to string
        if 'created' in user_dict:
            user_dict['created'] = user_dict['created'].isoformat() # Convert datetime to ISO format string
        return user_dict

    @staticmethod
    def from_dict(data: Dict[str, Any]) -> 'User':
        # Create a User instance from a MongoDB document.
        return User(
            _id=data.get('_id'),
            login=data.get('login'),
            password=data.get('password'),
            created=datetime.fromisoformat(data.get('created')) if data.get('created') else None
        )

    def get_id(self) -> str:
        # Return the string representation of _id for Flask-Login
        if self._id is None:
            return ""
        return str(self._id)
    
    # The methods __repr__ and __str__ both return string representations of the object.
    # __repr__ provides the official string representation of an object, aimed at the programmer
    # __str__ provides the informal string representation of an object, aimed at the user
    # example in datetime
    #   __repr__: datetime.datetime(2023, 2, 18, 18, 40, 2, 160890)
    #   __str__: 2023-02-18 18:40:02.160890
    
#     def __repr__(self) -> str:
#         pass

#     def __str__(self) -> str:
#         pass
