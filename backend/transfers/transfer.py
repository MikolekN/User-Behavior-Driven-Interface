import bson
from dataclasses import dataclass, field, asdict
from typing import Optional, Dict, Any
from datetime import datetime

@dataclass
class Transfer():
    _id: Optional[bson.ObjectId] = None
    created: Optional[datetime] = field(default_factory=datetime.now)
    transfer_from_id: bson.ObjectId = None
    transfer_to_id: bson.ObjectId = None
    title: str = ''
    amount: float = ''

    def to_dict(self) -> Dict[str, Any]:
        # Converts the Transfer instance to a dictionary suitable for MongoDB insertion.
        transfer_dict = asdict(self)
        if self._id is None:
            transfer_dict.pop('_id', None)  # Remove _id field if it is None, MongoDB will generate it
        else:
            transfer_dict['_id'] = str(self._id)  # Convert ObjectId to string
        if self.created:
            transfer_dict['created'] = self.created.isoformat()  # Convert datetime to ISO format string
        return transfer_dict

    @staticmethod
    def from_dict(data: Dict[str, Any]) -> 'Transfer':
        # Creates a Transfer instance from a MongoDB document.
        return Transfer(
            _id=bson.ObjectId(data['_id']) if '_id' in data else None,
            created=datetime.fromisoformat(data['created']) if 'created' in data else None,
            transfer_from_id=data.get('transfer_from_id', ''),
            transfer_to_id=data.get('transfer_to_id', ''),
            title=data.get('title', ''),
            amount=data.get('amount', '')
        )

    def get_id(self) -> str:
        # Returns the string representation of _id.
        return str(self._id) if self._id else ""

    def __repr__(self) -> str:
       # Returns a string representation of the Transfer instance for debugging.
        return (f"Transfer(_id={self._id}, created={self.created}, "
                f"transfer_from_id={self.transfer_from_id}, "
                f"transfer_to_id={self.transfer_to_id}, title='{self.title}', "
                f"amount={self.amount})")

    def __str__(self) -> str:
        # Returns a user-friendly string representation of the Transfer instance.
        return (f"Transfer(_id={self._id}, created={self.created}, transfer_from={self.transfer_from_id}, " 
                f"transfer_to={self.transfer_to_id}, title={self.title}, amount={self.amount})")