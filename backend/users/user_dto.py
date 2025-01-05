from dataclasses import dataclass
from typing import Dict, Any

from users import User


@dataclass
class UserDto:
    login: str
    email: str
    role: str

    @classmethod
    def from_user(cls, user: User) -> "UserDto":
        return cls(
            login=user.login or '',
            email=user.email or '',
            role=user.role or 'USER'
        )

    def to_dict(self) -> Dict[str, Any]:
        return {
            "login": self.login,
            "email": self.email,
            "role": self.role,
        }