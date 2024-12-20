from database import Database
from repository import BaseRepository
from users import User


class UserRepository(BaseRepository):
    COLLECTION: str = 'Users'

    @staticmethod
    def find_by_email(email: str) -> User | None:
        query = {'email': email}
        user_dict = Database.find_one(UserRepository.COLLECTION, query)
        if user_dict:
            return User.from_dict(user_dict)
        return None
    
    @staticmethod
    def find_by_account_number(account_number: str) -> User | None:
        query = {'account_number': account_number}
        user_dict = Database.find_one(UserRepository.COLLECTION, query)
        if user_dict:
            return User.from_dict(user_dict)
        return None
        
