import pymongo
from pymongo.collection import Collection
from pymongo.database import Database as PyMongoDatabase
from pymongo.results import InsertOneResult, InsertManyResult, DeleteResult, UpdateResult
from typing import Any

class Database:
    URI: str = "mongodb://localhost:27017/"
    DATABASE_NAME: str = "User-Behavior-Driven-Interface"
    DATABASE: PyMongoDatabase | None = None

    @staticmethod
    def initialise() -> None:
        client: pymongo.MongoClient = pymongo.MongoClient(Database.URI)
        Database.DATABASE = client[Database.DATABASE_NAME]

    @staticmethod
    def insert_many(collection: str, data: list[dict[str, Any]]) -> InsertManyResult:
        return Database._get_collection(collection).insert_many(data)

    @staticmethod
    def insert_one(collection: str, data: dict[str, Any]) -> InsertOneResult:
        return Database._get_collection(collection).insert_one(data)

    @staticmethod
    def find(collection: str, query: dict[str, Any], sort_criteria: dict[str, int] = None) -> pymongo.cursor.Cursor:
        query_result = Database._get_collection(collection).find(query)
        if sort_criteria:
            query_result = query_result.sort(sort_criteria)
        return query_result

    @staticmethod
    def find_one(collection: str, query: dict[str, Any]) -> dict[str, Any] | None:
        return Database._get_collection(collection).find_one(query)

    @staticmethod
    def delete_many(collection: str, query: dict[str, Any]) -> DeleteResult:
        return Database._get_collection(collection).delete_many(query)

    @staticmethod
    def delete_one(collection: str, query: dict[str, Any]) -> DeleteResult:
        return Database._get_collection(collection).delete_one(query)

    @staticmethod
    def update_many(collection: str, query: dict[str, Any], data: dict[str, Any]) -> UpdateResult:
        return Database._get_collection(collection).update_many(query, {"$set": data})

    @staticmethod
    def update_one(collection: str, query: dict[str, Any], data: dict[str, Any]) -> UpdateResult:
        return Database._get_collection(collection).update_one(query, {"$set": data})

    @staticmethod
    def _get_collection(collection: str) -> Collection:
        if Database.DATABASE is None:
            raise ValueError("Database not initialized. Call initialise() first.")
        return Database.DATABASE[collection]
