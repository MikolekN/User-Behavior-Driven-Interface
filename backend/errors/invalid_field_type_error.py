from typing import Any


class InvalidFieldTypeError(Exception):
    """Exception raised when the type of the field is incorrect."""
    def __init__(self, field: str, expected_type: str, provided_value: Any) -> None:
        super().__init__(
            f"InvalidFieldTypeError:\n"
            f"\tField '{field}' must be an instance of '{expected_type}' type.\n"
            f"\tProvided value: {provided_value} (type: {type(provided_value).__name__})"
        )
        self.field = field
        self.expected_type = expected_type
        self.provided_value = provided_value