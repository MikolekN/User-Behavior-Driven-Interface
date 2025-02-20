from abc import ABC, abstractmethod
from dataclasses import asdict, field, dataclass
from datetime import datetime
from typing import Dict, Any

import bson

from errors.invalid_data_error import InvalidDataError
from errors.invalid_field_type_error import InvalidFieldTypeError
from errors.missing_field_error import MissingFieldError


@dataclass(frozen=True)
class BaseEntity(ABC): # ABC = Abstract Base Classes
    _id: bson.ObjectId = field(default_factory=bson.ObjectId)
    created: datetime = field(default_factory=datetime.now)
    is_deleted: bool = field(default=False)

    @property
    def id(self) -> bson.ObjectId:
        """Getter for the id property of the entity."""
        return self._id

    def to_dict(self) -> Dict[str, Any]:
        """Convert the entity instance to its dictionary representation."""
        return asdict(self) # this works because the class is abstract and the classes that implement this class are of type 'DataclassInstance'

    def to_serialized_dict(self) -> Dict[str, Any]:
        """Convert the entity instance to its serialized dictionary representation."""
        entity_dict = self.to_dict()
        entity_dict['_id'] = str(self._id)
        entity_dict['created'] = str(self.created)
        return entity_dict

    @staticmethod
    def validate_dict(data: Dict[str, Any]) -> None:
        """Validate dictionary structure and types before conversion."""
        if not isinstance(data, dict):
            raise InvalidDataError(data)

        expected_types = {
            "_id":  bson.ObjectId,
            "created": datetime,
            "is_deleted": bool
        }

        for field_name, expected_type in expected_types.items():
            if field_name not in data:
                raise MissingFieldError(field_name, data, expected_type.__name__)
            value = data[field_name]
            if not isinstance(value, expected_type):
                raise InvalidFieldTypeError(field_name, expected_type.__name__, value)

    @staticmethod
    @abstractmethod
    def from_dict(data: Dict[str, Any]):
        """
            Validate and then convert the provided dictionary `data` into an instance of the class.

            Args:
                data (Dict[str, Any]): The dictionary containing the data to initialize the entity.

            Returns:
                T: The created instance of the class.

            Raises:
                InvalidDataError: If the provided data is not of type Dict.
                MissingFieldError: If a required field is missing in the provided data.
                InvalidFieldTypeError: If any field has an incorrect type in the provided data.
        """

    @abstractmethod
    def __str__(self) -> str:
        """
            Return a human-readable string representation of the instance.

            Returns:
                str: The string representation of the instance.
        """

