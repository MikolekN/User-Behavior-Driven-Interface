from typing import Dict, Any

class MissingFieldError(Exception):
    """Exception raised when a required field is missing in the input data."""
    def __init__(self, field: str, data: Dict[str, Any], expected_type: str) -> None:
        super().__init__(
            f"\n"
            f"\tMissing field '{field}' of type '{expected_type}' in provided data.\n"
            f"\tProvided data: {data}"
        )
        self.field = field
        self.data = data
        self.expected_type = expected_type