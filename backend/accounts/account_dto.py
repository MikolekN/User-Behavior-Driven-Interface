from dataclasses import dataclass
from typing import Dict, Any

from accounts import Account


@dataclass
class AccountDto:
    account_name: str
    account_number: str
    type:str
    blockades: float
    balance: float
    currency: str

    @classmethod
    def from_account(cls, account: Account) -> "AccountDto":
        return cls(
            account_name= account.account_name or '',
            account_number= account.account_number or '',
            type= account.type or '',
            blockades= account.blockades or 0,
            balance= account.balance or 0,
            currency= account.currency or '',
        )

    def to_dict(self) -> Dict[str, Any]:
        return {
            "account_name": self.account_name,
            "account_number": self.account_number,
            "type": self.type,
            "blockades": self.blockades,
            "balance": self.balance,
            "currency": self.currency
        }