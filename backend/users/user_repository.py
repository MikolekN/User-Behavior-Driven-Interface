from typing import Type

from repository import BaseRepository
from users import User


class UserRepository(BaseRepository):
    COLLECTION: str = 'Users'

    def __init__(self):
        super().__init__(self.COLLECTION)

    def _entity_class(self) -> Type[User]:
        return User

    def find_by_email(self, email: str) -> User | None:
        return super().find_by_field('email', email)

    def find_by_account_number(self, account_number: str) -> User | None:
        return super().find_by_field('account_number', account_number)
