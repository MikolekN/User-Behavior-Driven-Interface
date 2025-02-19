from abc import ABC, abstractmethod
from typing import Type, TypeVar, Dict, Any, Optional
from dataclasses import asdict, field, dataclass
from datetime import datetime
import bson

from errors.invalid_data_error import InvalidDataError
from errors.invalid_field_type_error import InvalidFieldTypeError
from errors.missing_field_error import MissingFieldError

T = TypeVar("T", bound="BaseEntity")

@dataclass
class BaseEntity(ABC): # ABC = Abstract Base Classes
    _id: bson.ObjectId = field(default_factory=bson.ObjectId)
    created: datetime = field(default_factory=datetime.now)
    is_deleted: bool = field(default=False)

    def to_dict(self, for_db: bool = False) -> Dict[str, Any]:
        """Convert the entity instance to its dictionary representation."""
        entity_dict = asdict(self) # this works because the class is abstract and the classes that implement this class are of type 'DataclassInstance'
        entity_dict['_id'] = self._id if for_db else str(self._id)  # Keep as ObjectId if for_db=True
        entity_dict['created'] = self.created if for_db else self.created.isoformat()
        return entity_dict

    @classmethod
    def validate_dict(cls: Type[T], data: Dict[str, Any]) -> None:
        """Validate dictionary structure and types before conversion."""
        if not isinstance(data, dict):
            raise InvalidDataError(data)

        for field, expected_type in cls.__annotations__.items():
            if field not in data:
                raise MissingFieldError(field, data, expected_type.__name__)
            if not isinstance(data[field], expected_type):
                raise InvalidFieldTypeError(field, expected_type.__name__, data[field])

    @abstractmethod
    def from_dict(self, data: Dict[str, Any]):
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

    @abstractmethod
    def __repr__(self) -> str:
        """
            Return a formal string representation of the instance.

            Returns:
                str: The formal string representation of the instance.
        """

    @property
    def id(self) -> bson.ObjectId:
        """Getter for the id property of the entity."""
        return self._id
