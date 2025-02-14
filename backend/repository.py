from bson import ObjectId
from typing import TypeVar, Type, Any, Optional, List
from abc import ABC, abstractmethod
from database import Database

T = TypeVar('T')

class BaseRepository:
    def __init__(self, collection: str):
        self.COLLECTION = collection

    @abstractmethod
    def _entity_class(self) -> Type[T]:
        raise NotImplementedError

    # ---------- FIND METHODS (FILTERS OUT SOFT DELETED RECORDS BY DEFAULT) ---------- #
    def find_by_id(self, entity_id: str) -> Optional[T]:
        return self.find_by_field('_id', ObjectId(entity_id))

    def find_by_field(self, field: str, value: Any) -> Optional[T]:
        query = {field: value, "is_deleted": False}
        entity_dict = Database.find_one(self.COLLECTION, query)
        if entity_dict:
            return self._entity_class().from_dict(entity_dict)
        return None

    def find_many(self, query: dict, sort_criteria: Optional[List[tuple[str, int]]] = None) -> Optional[List[T]]:
        query["is_deleted"] = False
        return self.find_many_full(query, sort_criteria)

    # ---------- FULL FIND METHODS (INCLUDES SOFT DELETED RECORDS) ---------- #
    def find_by_id_full(self, entity_id: str) -> Optional[T]:
        return self.find_by_field_full('_id', ObjectId(entity_id))

    def find_by_field_full(self, field: str, value: Any) -> Optional[T]:
        query = {field: value}
        entity_dict = Database.find_one(self.COLLECTION, query)
        if entity_dict:
            return self._entity_class().from_dict(entity_dict)
        return None

    def find_many_full(self, query: dict, sort_criteria: Optional[List[tuple[str, int]]] = None) -> Optional[List[T]]:
        sort_criteria = sort_criteria or []
        entities_cursor = Database.find(self.COLLECTION, query, sort_criteria)
        entities = list(entities_cursor)
        if not entities:
            return None
        return [self._entity_class().from_dict(item) for item in entities]

    # ---------- INSERT, UPDATE, DELETE (SOFT DELETE), RESTORE ---------- #
    def insert(self, entity: T) -> T:
        entity_dict = entity.to_dict(True)
        entity_dict["is_deleted"] = False
        result = Database.insert_one(self.COLLECTION, entity_dict)
        inserted_entity = self.find_by_id(result.inserted_id)
        if inserted_entity is None:
            raise ValueError(f"Failed to retrieve the {entity.__class__.__name__} after insertion.")
        return inserted_entity

    def update(self, entity_id: str, updates: dict[str, Any]) -> T | None:
        query = {'_id': ObjectId(entity_id), "is_deleted": False}
        result = Database.update_one(self.COLLECTION, query, updates)
        if result.matched_count == 0:
            return None
        return self.find_by_id(entity_id)

    def delete(self, entity_id: str) -> bool:
        query = {'_id': ObjectId(entity_id)}
        result = Database.update_one(self.COLLECTION, query, {"is_deleted": True})
        return result.matched_count > 0

    def restore(self, entity_id: str) -> bool:
        query = {'_id': ObjectId(entity_id), "is_deleted": True}
        result = Database.update_one(self.COLLECTION, query, {"is_deleted": False})
        return result.matched_count > 0
