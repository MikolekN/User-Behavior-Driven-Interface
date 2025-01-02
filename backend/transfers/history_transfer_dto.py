from dataclasses import dataclass
from typing import Dict, Any

from transfers import Transfer


@dataclass
class HistoryTransferDto:
    transfer_from_id: str
    transfer_to_id: str
    title: str
    amount: float
    income: bool
    issuer_name: str
    created: str

    @classmethod
    def from_transfer(cls, transfer: "Transfer", is_income: bool, issuer_name: str) -> "HistoryTransferDto":
        return cls(
            transfer_from_id=str(transfer.transfer_from_id) or '',
            transfer_to_id=str(transfer.transfer_to_id) or '',
            title=transfer.title or '',
            amount=float(transfer.amount or 0),
            income=is_income,
            issuer_name=issuer_name,
            created=transfer.created.strftime('%d.%m.%Y')
        )

    def to_dict(self) -> Dict[str, Any]:
        return {
            "transfer_from_id": self.transfer_from_id,
            "transfer_to_id": self.transfer_to_id,
            "title": self.title,
            "amount": self.amount,
            "income": self.income,
            "issuer_name": self.issuer_name,
            "created": self.created
        }