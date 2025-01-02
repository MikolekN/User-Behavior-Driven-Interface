import bson
from dataclasses import dataclass, field, asdict
from typing import Optional, Dict, Any
from datetime import datetime

from entity import BaseEntity


@dataclass
class Transfer(BaseEntity):
    transfer_from_id: Optional[bson.ObjectId] = None
    transfer_to_id: Optional[bson.ObjectId] = None
    title: Optional[str] = ''
    amount: Optional[float] = ''

    @staticmethod
    def from_dict(data: Dict[str, Any]) -> 'Transfer':
        return Transfer(
            _id=bson.ObjectId(data['_id']) if '_id' in data else None,
            created=datetime.fromisoformat(data['created']) if 'created' in data else None,
            transfer_from_id=bson.ObjectId(data['transfer_from_id']) if 'transfer_from_id' in data else None,
            transfer_to_id=bson.ObjectId(data['transfer_to_id']) if 'transfer_to_id' in data else None,
            title=data.get('title', ''),
            amount=data.get('amount', 0)
        )

    def __repr__(self) -> str:
        return (f"Transfer(_id={self._id!r}, "
                f"created={self.created!r}, "
                f"transfer_from_id={self.transfer_from_id!r}, "
                f"transfer_to_id={self.transfer_to_id!r}, "
                f"title='{self.title!r}', "
                f"amount={self.amount!r})")