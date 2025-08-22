import bson

from models.model_repository import ModelRepository

model_repository = ModelRepository()

def delete_model(user_id: bson.ObjectId) -> None:
    model = model_repository.find_by_user(user_id)
    if model:
        model_repository.delete(str(model.id))
