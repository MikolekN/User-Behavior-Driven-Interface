from collections.abc import Mapping
from dataclasses import dataclass
from typing import Any, Optional, Type


@dataclass
class BaseRequest:

    @staticmethod
    def _get_all_annotations(dto_class: Type["BaseRequest"]) -> dict[str, Any]:
        annotations = {}
        for cls in reversed(dto_class.__mro__):
            if hasattr(cls, "__annotations__"):
                annotations.update(cls.__annotations__)
        return annotations

    @staticmethod
    def _validate_request(dto_class: Type["BaseRequest"], data: Mapping[str, Any]) -> Optional[str]:
        if not data:
            return "emptyRequestPayload"

        if not isinstance(data, dict):
            return "invalidRequestPayload"

        all_annotations = BaseRequest._get_all_annotations(dto_class)
        
        required_fields: list[dict[str, Any]] = [
            {
                "field_name": field_name,
                "field_type": field_type,
                "field_value": data.get(field_name)
            }
            for field_name, field_type in all_annotations.items()
        ]

        missing_fields = [field["field_name"] for field in required_fields if field["field_value"] is None]
        if missing_fields:
            return f"missingFields;{','.join(missing_fields)}"

        allowed_field_names = {field["field_name"] for field in required_fields}
        extra_fields = [field for field in data if field not in allowed_field_names]
        if extra_fields:
            return f"extraFields;{','.join(extra_fields)}"

        invalid_type_fields = []
        empty_fields = []

        for field in required_fields:
            if not isinstance(field["field_value"], field["field_type"]):
                invalid_type_fields.append(field["field_name"])

            if isinstance(field["field_value"], str) and not field["field_value"].strip():
                empty_fields.append(field["field_name"])

        if invalid_type_fields:
            return f"invalidTypeFields;{','.join(invalid_type_fields)}"
        if empty_fields:
            return f"emptyFields;{','.join(empty_fields)}"

        return None
