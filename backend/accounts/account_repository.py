from typing import Type, Optional

import bson
from flask_login import current_user

from accounts import Account
from repository import BaseRepository


class AccountRepository(BaseRepository):
    COLLECTION: str = 'Accounts'

    def __init__(self):
        super().__init__(self.COLLECTION)

    def _entity_class(self) -> Type[Account]:
        return Account

    def find_by_account_number(self, account_number: str) -> Optional[Account]:
        return super().find_by_field('account_number', account_number)

    def find_accounts(self, id:str) -> list[Account]:
        query = {
            'user': bson.ObjectId(id)
        }
        sort_criteria = [("created", -1)]
        return super().find_many(query, sort_criteria)


