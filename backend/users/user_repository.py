from typing import Any

from repository import BaseRepository
from users import User


class UserRepository(BaseRepository):
    def __init__(self):
        super().__init__('Users')

    def find_by_id(self, user_id: str) -> User | None:
        return super().find_by_id(user_id, User)

    def find_by_field(self, field: str, value: Any) -> User | None:
        return super().find_by_field(field, value, User)

    def find_many(self, query: dict, sort_criteria: list[tuple[str, int]] = None) -> list[User] | None:
        return super().find_many(User, query, sort_criteria)

    def insert(self, user: User) -> User:
        return super().insert(user)

    def update(self, user_id: str, updates: dict[str, Any]) -> User | None:
        return super().update(user_id, updates, User)

    def delete(self, user_id: str) -> bool:
        return super().delete(user_id)

    def find_by_email(self, email: str) -> User | None:
        return super().find_by_field('email', email, User)

    def find_by_account_number(self, account_number: str) -> User | None:
        return super().find_by_field('account_number', account_number, User)
