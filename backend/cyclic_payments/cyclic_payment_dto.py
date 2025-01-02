from dataclasses import dataclass
from typing import Dict, Any

from cyclic_payments import CyclicPayment


@dataclass
class CyclicPaymentDto:
    _id: str
    recipient_account_number: str
    recipient_name: str
    cyclic_payment_name: str
    transfer_title: str
    amount: float
    start_date: str
    interval: str

    @classmethod
    def from_cyclic_payment(cls, cyclic_payment: "CyclicPayment") -> "CyclicPaymentDto":
        return cls(
            _id=str(cyclic_payment.id),
            recipient_account_number=cyclic_payment.recipient_account_number,
            recipient_name=cyclic_payment.recipient_name,
            cyclic_payment_name=cyclic_payment.cyclic_payment_name,
            transfer_title=cyclic_payment.transfer_title,
            amount=cyclic_payment.amount,
            start_date=cyclic_payment.start_date.isoformat(),
            interval=cyclic_payment.interval
        )

    def to_dict(self) -> Dict[str, Any]:
        return {
            "_id":self._id,
            "recipient_account_number": self.recipient_account_number,
            "recipient_name": self.recipient_name,
            "cyclic_payment_name": self.cyclic_payment_name,
            "transfer_title": self.transfer_title,
            "amount": self.amount,
            "start_date": self.start_date,
            "interval": self.interval
        }