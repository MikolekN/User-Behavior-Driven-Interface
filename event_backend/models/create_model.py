import bson

from models.model import Model
from models.model_repository import ModelRepository

model_repository = ModelRepository()

def create_model(user_id: bson.ObjectId, model_id:str) -> None:
    model = Model(
        user_id=user_id,
        model_id=model_id
    )
    model_repository.insert(model)