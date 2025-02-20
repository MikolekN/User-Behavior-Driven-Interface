from dataclasses import dataclass, field
from typing import Optional, Dict, Any

import bson
from flask_login import UserMixin

from entity import BaseEntity
from errors.invalid_field_type_error import InvalidFieldTypeError
from errors.missing_field_error import MissingFieldError


@dataclass(frozen=True)
class User(BaseEntity, UserMixin):
    login: str = field(default="")
    email: str = field(default="")
    password: str = field(default="")
    active_account: Optional[bson.ObjectId] = field(default=None)
    user_icon: Optional[str] = field(default=None)
    role: str = field(default="")

    def to_serialized_dict(self) -> Dict[str, Any]:
        """Convert the User object to its serialized dictionary representation."""
        user_dict = super().to_serialized_dict()
        user_dict.pop('password', None)
        if self.active_account:
            user_dict['active_account'] = str(self.active_account)
        user_dict.pop('user_icon', None)
        return user_dict

    @staticmethod
    def validate_dict(data: Dict[str, Any]) -> None:
        """Validate dictionary structure and types before conversion."""
        BaseEntity.validate_dict(data)

        expected_types = {
            "login": str,
            "email": str,
            "password": str,
            "role": str
        }

        for field_name, expected_type in expected_types.items():
            if expected_type is not None:
                if field_name not in data:
                    raise MissingFieldError(field_name, data, expected_type.__name__)
                value = data[field_name]
                if not isinstance(value, expected_type):
                    raise InvalidFieldTypeError(field_name, expected_type.__name__, value)

        optional_types = {
            "active_account": bson.ObjectId,
            "user_icon": str,
        }

        for field_name, expected_type in optional_types.items():
            if field_name in data and expected_type is not None and not isinstance(data[field_name], expected_type):
                raise InvalidFieldTypeError(field_name, expected_type.__name__, data[field_name])

    @staticmethod
    def from_dict(data: Dict[str, Any]) -> 'User':
        User.validate_dict(data)
        return User(
            _id =  data['_id'],
            created = data['created'],
            is_deleted = data['is_deleted'],
            login = data['login'],
            email = data['email'],
            password = data['password'],
            active_account= data['active_account'],
            user_icon = data['user_icon'],
            role = data['role']
        )

    def __str__(self) -> str:
        return (f"User("
                f"_id={self._id!r}, "
                f"created={self.created!r}, "
                f"is_deleted={self.is_deleted!r}, "
                f"login={self.login!r}, "
                f"email={self.email!r}, "
                f"password={self.password!r}, "
                f"active_account={self.active_account!r}, "
                f"user_icon={self.user_icon!r}, "
                f"role={self.role!r})")

    """
        Example of user data inside a deserialized dictionary.
        user_data = {
            "_id": bson.ObjectId("65d4f1e5b2e68d4d8a3f5b7c"),
            "created": datetime.utcnow(),
            "is_deleted": False,
            "login": "test_user",
            "email": "test@example.com",
            "password": "securepassword",
            "active_account": bson.ObjectId("65d4f1e5b2e68d4d8a3f5b7d"),
            "user_icon": "avatar.png",
            "role": "admin"
        }
    """


