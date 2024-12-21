from typing import Optional, Any

from accounts import Account
from repository import BaseRepository


class AccountRepository(BaseRepository):
    COLLECTION: str = 'Accounts'

    def find_by_id(self, account_id: str) -> Optional[Account]:
        return super().find_by_id(account_id, Account)

    def find_by_field(self, field: str, value: Any) -> Account | None:
        return super().find_by_field(field, value, Account)

    def find_many(self, query: dict, sort_criteria: list[tuple[str, int]] = None) -> list[Account] | None:
        return super().find_many(Account, query, sort_criteria)

    def insert(self, account: Account) -> Account:
        return super().insert(account)

    def update(self, account_id: str, updates: dict[str, Any]) -> Account | None:
        return super().update(account_id, updates, Account)

    def delete(self, account_id: str) -> bool:
        return super().delete(account_id)