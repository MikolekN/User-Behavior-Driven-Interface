from typing import Type

from accounts import Account
from repository import BaseRepository


class AccountRepository(BaseRepository):
    COLLECTION: str = 'Accounts'

    def __init__(self):
        super().__init__(self.COLLECTION)

    def _entity_class(self) -> Type[Account]:
        return Account