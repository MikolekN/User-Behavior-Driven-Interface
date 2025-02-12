from bson import ObjectId


def validate_object_id(oid: str) -> str | None:
    if not ObjectId.is_valid(oid):
        return "invalidObjectId"
    return None
