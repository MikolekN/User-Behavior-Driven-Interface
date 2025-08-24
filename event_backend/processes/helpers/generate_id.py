import uuid


def generate_id(prefix):
    uuid_str = str(uuid.uuid4()).replace("-", "_")
    return f"{prefix}_{uuid_str}"
