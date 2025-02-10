import bson
from dataclasses import dataclass, field, asdict
from typing import Optional, Dict, Any
from datetime import datetime

from entity import BaseEntity


@dataclass
class Transfer(BaseEntity):
    sender_account_number: Optional[bson.ObjectId] = None
    recipient_account_number: Optional[bson.ObjectId] = None
    title: Optional[str] = ''
    amount: Optional[float] = ''

    @staticmethod
    def from_dict(data: Dict[str, Any]) -> 'Transfer':
        return Transfer(
            _id=bson.ObjectId(data['_id']) if '_id' in data else None,
            created=datetime.fromisoformat(data['created']) if 'created' in data else None,
            sender_account_number=bson.ObjectId(data['sender_account_number']) if 'sender_account_number' in data else None,
            recipient_account_number=bson.ObjectId(data['recipient_account_number']) if 'recipient_account_number' in data else None,
            title=data.get('title', ''),
            amount=data.get('amount', 0)
        )

    def to_dict(self) -> Dict[str, Any]:
        transfer_dict = super().to_dict()
        transfer_dict['sender_account_number'] = str(self.sender_account_number)
        transfer_dict['recipient_account_number'] = str(self.recipient_account_number)
        return transfer_dict

    def __repr__(self) -> str:
        return (f"Transfer(_id={self._id!r}, "
                f"created={self.created!r}, "
                f"sender_account_number={self.sender_account_number!r}, "
                f"recipient_account_number={self.recipient_account_number!r}, "
                f"title='{self.title!r}', "
                f"amount={self.amount!r})")