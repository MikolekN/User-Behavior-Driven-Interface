from typing import Any

class InvalidDataError(Exception):
    """Exception raised when a required field is missing in the input data."""
    def __init__(self, data: Any) -> None:
        super().__init__(
            f"\n"
            f"\tArgument 'data' must be a dictionary.\n"
            f"\tProvided data: {data} (type: {type(data).__name__})"
        )
        self.data = data