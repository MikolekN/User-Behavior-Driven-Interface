from typing import Optional, Any

from models.model import Model
from models.model_repository import ModelRepository

model_repository = ModelRepository()

def update_model(model_id: str, updates: dict[str, Any]) -> Optional[Model]:
    return model_repository.update(model_id, updates)