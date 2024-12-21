from typing import Type

from repository import BaseRepository
from transfers import Transfer


class TransferRepository(BaseRepository):
    COLLECTION: str = 'Transfers'

    def __init__(self):
        super().__init__(self.COLLECTION)

    def _entity_class(self) -> Type[Transfer]:
        return Transfer

    def find_transfers(self, query: dict, sort_criteria: list[tuple[str, int]] = None):
        return super().find_many(query, sort_criteria)

    def find_by_transfer_from_id(self, transfer_from_id: str) -> Transfer | None:
        return super().find_by_field('transfer_from_id', transfer_from_id)

    def find_by_transfer_to_id(self, transfer_to_id: str) -> Transfer | None:
        return super().find_by_field('transfer_to_id', transfer_to_id)