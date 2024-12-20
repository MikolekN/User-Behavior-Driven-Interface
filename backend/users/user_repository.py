from repository import BaseRepository
from users import User


class UserRepository(BaseRepository):
    def __init__(self):
        super().__init__('Users')

    def find_by_email(self, email: str) -> User | None:
        return super().find_by_field('email', email, User)
    
    def find_by_account_number(self, account_number: str) -> User | None:
        return super().find_by_field('account_number', account_number, User)
