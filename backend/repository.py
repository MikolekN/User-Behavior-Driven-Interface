from bson import ObjectId
from typing import TypeVar, Type, Any, Optional, List

from database import Database

T = TypeVar('T')

class BaseRepository:
    def __init__(self, collection: str):
        self.COLLECTION = collection

    def find_by_id(self, entity_id: str, entity_class: Type[T]) -> Optional[T]:
        return self.find_by_field('_id', ObjectId(entity_id))

    def find_by_field(self, field: str, value: Any, entity_class: Type[T]) -> Optional[T]:
        query = {field: value}
        entity_dict = Database.find_one(self.COLLECTION, query)
        if entity_dict:
            return entity_class.from_dict(entity_dict)
        return None

    def find_many(self, entity_class: Type[T], query: dict, sort_criteria: Optional[List[tuple[str, int]]] = None) -> Optional[List[T]]:
        sort_criteria = sort_criteria or []
        entities_cursor = Database.find(self.COLLECTION, query, sort_criteria)
        entities = list(entities_cursor)
        if not entities:
            return None
        return [entity_class.from_dict(item) for item in entities]

    def insert(self, entity: T) -> T:
        entity_dict = entity.to_dict()
        result = Database.insert_one(self.COLLECTION, entity_dict)
        inserted_entity = self.find_by_id(str(result.inserted_id))
        if inserted_entity is None:
            raise ValueError(f"Failed to retrieve the {entity.__class__.__name__} after insertion.")
        return inserted_entity

    def update(self, entity_id: str, updates: dict[str, Any], entity_class: Type[T]) -> T | None:
        query = {'_id': ObjectId(entity_id)}
        result = Database.update_one(self.COLLECTION, query, updates)
        if result.matched_count == 0:
            return None
        return self.find_by_id(entity_id)

    def delete(self, entity_id: str) -> bool:
        query = {'_id': ObjectId(entity_id)}
        result = Database.delete_one(self.COLLECTION, query)
        return result.deleted_count > 0
