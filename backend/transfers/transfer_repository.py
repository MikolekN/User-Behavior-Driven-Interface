from typing import Type, Optional, List

from shared import BaseRepository

from transfers import Transfer


class TransferRepository(BaseRepository):
    COLLECTION: str = 'Transfers'

    def __init__(self):
        super().__init__(self.COLLECTION)

    def _entity_class(self) -> Type[Transfer]:
        return Transfer

    def find_transfers(self, query: dict, sort_criteria: list[tuple[str, int]] = None) -> Optional[List[Transfer]]:
        return super().find_many(query, sort_criteria)

    def find_by_transfer_from_id(self, transfer_from_id: str) -> Optional[Transfer]:
        return super().find_by_field('transfer_from_id', transfer_from_id)

    def find_by_transfer_to_id(self, transfer_to_id: str) -> Optional[Transfer]:
        return super().find_by_field('transfer_to_id', transfer_to_id)
