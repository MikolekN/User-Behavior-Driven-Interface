from collections.abc import Mapping
from dataclasses import dataclass
from typing import Any, Optional


@dataclass
class UpdateUserRequest:

    @staticmethod
    def validate_request(data: Mapping[str, Any]) -> Optional[str]:
        if not data:
            return "emptyRequestPayload"

        valid_fields = {'login', 'current_password', 'new_password'}
        invalid_fields = [field for field in data if field not in valid_fields]

        if invalid_fields:
            return f"missingFields;{', '.join(invalid_fields)}"

        if ('current_password' in data or 'new_password' in data) and (
                'current_password' not in data or 'new_password' not in data):
            return "userPasswordRequiredFields"

        invalid_type_fields = []
        empty_fields = []

        for field in valid_fields:
            if field in data:
                if not isinstance(field, str):
                    invalid_type_fields.append(field)

                if isinstance(field, str) and not field.strip():
                    empty_fields.append(field)

        if invalid_type_fields:
            return f"invalidTypeFields;{','.join(invalid_type_fields)}"
        if empty_fields:
            return f"emptyFields;{','.join(empty_fields)}"

        return None