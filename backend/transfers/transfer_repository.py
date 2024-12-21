from typing import Optional, Any

from repository import BaseRepository
from transfers import Transfer


class TransferRepository(BaseRepository):
    def __init__(self):
        super().__init__('Transfers')

    def find_by_id(self, transfer_id: str) -> Optional[Transfer]:
        return super().find_by_id(transfer_id, Transfer)

    def find_by_field(self, field: str, value: Any) -> Transfer | None:
        return super().find_by_field(field, value, Transfer)

    def find_many(self, query: dict, sort_criteria: list[tuple[str, int]] = None) -> list[Transfer] | None:
        return super().find_many(Transfer, query, sort_criteria)

    def insert(self, transfer: Transfer) -> Transfer:
        return super().insert(transfer)

    def update(self, transfer_id: str, updates: dict[str, Any]) -> Transfer | None:
        return super().update(transfer_id, updates, Transfer)

    def delete(self, transfer_id: str) -> bool:
        return super().delete(transfer_id)

    def find_transfers(self, query: dict, sort_criteria: list[tuple[str, int]] = None):
        return super().find_many(Transfer, query, sort_criteria)

    def find_by_transfer_from_id(self, transfer_from_id: str) -> Transfer | None:
        return super().find_by_field('transfer_from_id', transfer_from_id, Transfer)

    def find_by_transfer_to_id(self, transfer_to_id: str) -> Transfer | None:
        return super().find_by_field('transfer_to_id', transfer_to_id, Transfer)