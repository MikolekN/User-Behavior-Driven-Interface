from typing import Optional, Dict
import bson
from database import Database
from users.user import User

class UserRepository:
    COLLECTION = 'Users'

    @staticmethod
    def find_by_id(user_id: str) -> Optional[User]:
        query = {'_id': bson.ObjectId(user_id)}
        user_dict = Database.find_one(UserRepository.COLLECTION, query)
        if user_dict:
            return User.from_dict(user_dict)
        return None

    @staticmethod
    def find_by_login(login: str) -> Optional[User]:
        query = {'login': login}
        user_dict = Database.find_one(UserRepository.COLLECTION, query)
        if user_dict:
            return User.from_dict(user_dict)
        return None

    @staticmethod
    def insert(user: User) -> User:
        user_dict = user.to_dict()
        result = Database.insert_one(UserRepository.COLLECTION, user_dict)
        user = UserRepository.find_by_id(result.inserted_id)
        return user