import bson
from database import Database
from users.user import User

class UserRepository:
    COLLECTION: str = 'Users'

    @staticmethod
    def find_by_id(user_id: str) -> User | None:
        query = {'_id': bson.ObjectId(user_id)}
        user_dict = Database.find_one(UserRepository.COLLECTION, query)
        if user_dict:
            return User.from_dict(user_dict)
        return None

    @staticmethod
    def find_by_login(login: str) -> User | None:
        query = {'login': login}
        user_dict = Database.find_one(UserRepository.COLLECTION, query)
        if user_dict:
            return User.from_dict(user_dict)
        return None

    @staticmethod
    def insert(user: User) -> User:
        user_dict = user.to_dict()
        result = Database.insert_one(UserRepository.COLLECTION, user_dict)
        
        inserted_user = UserRepository.find_by_id(str(result.inserted_id))
        
        if inserted_user is None:
            raise ValueError("Failed to retrieve the user after insertion.")
        
        return inserted_user
