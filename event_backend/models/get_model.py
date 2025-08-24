from typing import Optional

import bson

from models.model import Model
from models.model_repository import ModelRepository

model_repository = ModelRepository()


def get_model(user_id: bson.ObjectId) -> Optional[Model]:
    return model_repository.find_by_user(user_id)
