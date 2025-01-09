from dataclasses import dataclass
from typing import Dict, Any

from users import User


@dataclass
class UserDto:
    login: str
    email: str
    account_name: str
    account_number: str
    balance: float
    blockades: float
    currency: str
    role: str

    @classmethod
    def from_user(cls, user: User) -> "UserDto":
        return cls(
            login=user.login or '',
            email=user.email or '',
            account_name=user.account_name or '',
            account_number=user.account_number or '',
            balance=float(user.balance or 0),
            blockades=float(user.blockades or 0),
            currency=user.currency or '',
            role=user.role or 'USER'
        )

    def to_dict(self) -> Dict[str, Any]:
        return {
            "login": self.login,
            "email": self.email,
            "account_name": self.account_name,
            "account_number": self.account_number,
            "balance": self.balance,
            "blockades": self.blockades,
            "currency": self.currency,
            "role": self.role,
        }