import bson
from dataclasses import dataclass, field, asdict
from typing import Optional, Dict, Any
from datetime import datetime

from entity import BaseEntity


@dataclass
class CyclicPayment(BaseEntity):
    issuer_id: Optional[bson.ObjectId] = None
    recipient_id: Optional[bson.ObjectId] = None
    cyclic_payment_name: Optional[str] = ''
    transfer_title: Optional[str] = ''
    amount: Optional[float] = ''
    start_date: datetime = field(default_factory=datetime.now)
    interval: Optional[str] = ''

    def to_dict(self) -> Dict[str, any]:
        cyclic_payment_dict = super().to_dict()
        cyclic_payment_dict['start_date'] = self.start_date.isoformat()
        cyclic_payment_dict['issuer_id'] = str(self.issuer_id)
        cyclic_payment_dict['recipient_id'] = str(self.recipient_id)
        return cyclic_payment_dict
    
    @staticmethod
    def from_dict(data: Dict[str, Any]) -> 'CyclicPayment':
        return CyclicPayment(
            _id=bson.ObjectId(data['_id']) if '_id' in data else None,
            created=datetime.fromisoformat(data['created']) if 'created' in data else None,
            issuer_id=bson.ObjectId(data['issuer_id']) if 'issuer_id' in data else None,
            recipient_id=bson.ObjectId(data['recipient_id']) if 'recipient_id' in data else None,
            cyclic_payment_name=data.get('cyclic_payment_name', ''),
            transfer_title=data.get('transfer_title', ''),
            amount=data.get('amount', 0),
            start_date=datetime.fromisoformat(data['start_date']),
            interval=data.get('interval', '')
        )
        
    def __repr__(self) -> str:
        return (f"CyclicPayment(_id={self._id!r}, "
                f"created={self.created!r}, "
                f"issuer_id={self.issuer_id!r}, "
                f"recipient_id={self.recipient_id!r}, "
                f"cyclic_payment_name={self.cyclic_payment_name!r}', "
                f"transfer_title={self.transfer_title!r}', "
                f"amount={self.amount!r}', "
                f"start_date={self.start_date!r}', "
                f"interval={self.interval!r})")
