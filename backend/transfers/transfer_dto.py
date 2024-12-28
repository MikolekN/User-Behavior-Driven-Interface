from dataclasses import dataclass
from typing import Dict, Any

from transfers import Transfer


@dataclass
class TransferDto:
    transfer_from_id: str
    transfer_to_id: str
    title: str
    amount: float

    @classmethod
    def from_transfer(cls, transfer: "Transfer") -> "TransferDto":
        return cls(
            transfer_from_id=transfer.transfer_from_id or '',
            transfer_to_id=transfer.transfer_to_id or '',
            title=transfer.title or '',
            amount=float(transfer.amount or 0)
        )

    def to_dict(self) -> Dict[str, Any]:
        return {
            "transfer_from_id": self.transfer_from_id,
            "transfer_to_id": self.transfer_to_id,
            "title": self.title,
            "amount": self.amount
        }