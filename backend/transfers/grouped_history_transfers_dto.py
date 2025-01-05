from dataclasses import dataclass
from typing import Dict, Any

from transfers.history_transfer_dto import HistoryTransferDto


@dataclass
class GroupedHistoryTransfersDto:
    date: str
    transactions: list[HistoryTransferDto]

    @classmethod
    def from_transfer_group(cls, date: str, user_transfers: list["HistoryTransferDto"]) -> "GroupedHistoryTransfersDto":
        return cls(
            date=date,
            transactions=user_transfers
        )

    def to_dict(self) -> Dict[str, Any]:
        return {
            "date": self.date,
            "transactions": self.transactions
        }