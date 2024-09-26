import bson
from dataclasses import dataclass, field, asdict
from typing import Optional, Dict, Any
from datetime import datetime

@dataclass # dodanie amount do blockades i zapisanie cyclic payment
class CyclicPayment():
    _id: Optional[bson.ObjectId] = None
    created: Optional[datetime] = field(default_factory=datetime.now)
    issuer_id: bson.ObjectId = None
    recipient_id: bson.ObjectId = None
    recipient_account_number: str = ''
    recipient_name: str = ''
    cyclic_payment_name: str = ''
    transfer_title: str = ''
    amount: float = ''
    start_date: datetime = field(default_factory=datetime.now)
    interval: str = ''

    def to_dict(self) -> Dict[str, any]:
        cyclic_payment_dict = asdict(self)
        if self._id is None:
            cyclic_payment_dict.pop('_id', None)
        else:
            cyclic_payment_dict['_id'] = str(self._id)
        if self.created:
            cyclic_payment_dict['created'] = self.created.isoformat()
        cyclic_payment_dict['start_date'] = self.start_date.isoformat()
        return cyclic_payment_dict
    
    @staticmethod
    def from_dict(data: Dict[str, Any]) -> 'CyclicPayment':
        # Creates a Transfer instance from a MongoDB document.
        return CyclicPayment(
            _id=bson.ObjectId(data['_id']) if '_id' in data else None,
            created=datetime.fromisoformat(data['created']) if 'created' in data else None,
            issuer_id=data.get('issuer_id', ''),
            recipient_id=data.get('recipient_id', ''),
            recipient_account_number=data.get('recipient_account_number', ''),
            recipient_name=data.get('recipient_name', ''),
            cyclic_payment_name=data.get('cyclic_payment_name', ''),
            transfer_title=data.get('transfer_title', ''),
            amount=data.get('amount', ''),
            start_date=datetime.fromisoformat(data['start_date']),
            interval=data.get('interval', '')
        )

    def get_id(self) -> str:
        # Returns the string representation of _id.
        return str(self._id) if self._id else ""

    def __repr__(self) -> str:
       # Returns a string representation of the Transfer instance for debugging.
        return (f"CyclicPayment(_id={self._id}, created={self.created}, "
                f"issuer_id={self.issuer_id}, recipient_id={self.recipient_id}, "
                f"recipient_account_number='{self.recipient_account_number}', "
                f"recipient_name='{self.recipient_name}', "
                f"cyclic_payment_name='{self.cyclic_payment_name}', "
                f"transfer_title='{self.transfer_title}', amount={self.amount}, "
                f"start_date={self.start_date}, interval='{self.interval}')")

    def __str__(self) -> str:
        # Returns a user-friendly string representation of the Transfer instance.
        return (f"Cyclic Payment: '{self.cyclic_payment_name}' from {self.issuer_id} "
                f"to {self.recipient_id}: {self.amount} on {self.start_date} (Interval: {self.interval})")
