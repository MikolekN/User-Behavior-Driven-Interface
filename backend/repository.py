from bson import ObjectId
from typing import TypeVar, Type

from database import Database

T = TypeVar('T')

class BaseRepository:
    COLLECTION: str

    @staticmethod
    def find_by_id(entity_id: str, entity_class: Type[T]) -> T | None:
        query = {'_id': ObjectId(entity_id)}
        entity_dict = Database.find_one(BaseRepository.COLLECTION, query)
        if entity_dict:
            return entity_class.from_dict(entity_dict)
        return None

    @staticmethod
    def find_many(entity_class: Type[T],query: dict, sort_criteria: list[tuple[str, int]] = None) -> list[T] | None:
        entities_cursor = Database.find(BaseRepository.COLLECTION, query, sort_criteria)
        entities = list(entities_cursor)
        if not entities:
            return None
        return [entity_class.from_dict(item) for item in entities]

    @staticmethod
    def insert(entity: T) -> T:
        entity_dict = entity.to_dict()
        result = Database.insert_one(BaseRepository.COLLECTION, entity_dict)
        inserted_entity = BaseRepository.find_by_id(str(result.inserted_id), entity.__class__)
        if inserted_entity is None:
            raise ValueError(f"Failed to retrieve the {entity.__class__.__name__} after insertion.")
        return inserted_entity

    @staticmethod
    def update(entity_id: str, updates: dict[str, any], entity_class: Type[T]) -> T | None:
        query = {'_id': ObjectId(entity_id)}
        result = Database.update_one(BaseRepository.COLLECTION, query, updates)
        if result.matched_count == 0:
            return None
        return BaseRepository.find_by_id(entity_id, entity_class)

    @staticmethod
    def delete(entity_id: str) -> bool:
        query = {'_id': ObjectId(entity_id)}
        result = Database.delete_one(BaseRepository.COLLECTION, query)
        return result.deleted_count > 0
