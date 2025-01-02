import application
from users.user_repository import UserRepository
from database import Database
from users import User


def test_user_repository():
    user_repo = UserRepository()

    user_by_id = user_repo.find_by_id(str(999999999999999999999999))
    assert user_by_id is None, "Non existent user found by id."

    user_by_email = user_repo.find_by_email("john.doe@example.com")
    assert user_by_email is None, "Non existent user found by email."

    updated_data = {"balance": 2000.0}
    updated_user = user_repo.update(str(999999999999999999999999), updated_data)
    assert updated_user is None, "Non existent user updated."

    deletion_result = user_repo.delete(str(999999999999999999999999))
    assert not deletion_result, "Non existent user deleted."

    user_data = {
        "login": "john_doe",
        "email": "john.doe@example.com",
        "password": "securepassword123",
        "account_name": "John's Account",
        "account_number": "123456789",
        "blockades": 0.0,
        "balance": 1000.0,
        "currency": "USD",
        "role": "user",
        "user_icon": None
    }

    # Insert a new user
    user = User(**user_data)
    inserted_user = user_repo.insert(user)
    assert inserted_user is not None, "User was not inserted."
    assert inserted_user.email == "john.doe@example.com", "Inserted user email is incorrect."

    # Find the user by ID
    user_by_id = user_repo.find_by_id(str(inserted_user._id))
    assert user_by_id is not None, "User not found by ID."
    assert user_by_id._id == inserted_user._id, "User found by ID does not match the inserted user."

    # Find the user by email
    user_by_email = user_repo.find_by_email("john.doe@example.com")
    assert user_by_email is not None, "User not found by email."
    assert user_by_email.email == "john.doe@example.com", "User found by email has incorrect email."

    # Update the user
    updated_data = {"balance": 2000.0}
    updated_user = user_repo.update(str(inserted_user._id), updated_data)
    assert updated_user is not None, "User update failed."
    assert updated_user.balance == 2000.0, "Updated user balance is incorrect."

    # Find the user by account number
    user_by_account = user_repo.find_by_account_number("123456789")
    assert user_by_account is not None, "User not found by account number."
    assert user_by_account.account_number == "123456789", "User found by account number has incorrect account number."

    # Delete the user
    deletion_result = user_repo.delete(str(inserted_user._id))
    assert deletion_result, "User was not deleted successfully."

if __name__ == "__main__":
    app = application.create_app()
    app.config.update({"TESTING": True})

    test_user_repository()
