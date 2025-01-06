import bcrypt
import bson

from accounts import Account
from tests.constants import TEST_USER_ID, TEST_USER_PASSWORD, TEST_ACCOUNT_ID, TEST_USER_ROLE, TEST_ACCOUNT_NAME, \
    TEST_ACCOUNT_TYPE, TEST_ACCOUNT_NUMBER, TEST_ACCOUNT_BLOCKADES, TEST_ACCOUNT_BALANCE, TEST_ACCOUNT_CURRENCY
from users import User


def assert_json_response(response, expected_status_code, expected_message):
    assert response.status_code == expected_status_code
    json_data = response.get_json()
    assert 'message' in json_data
    assert json_data['message'] == expected_message
    return json_data

def generate_hashed_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def _create_user(login, email):
    return User(
        _id=TEST_USER_ID,
        login=login,
        email=email,
        password=generate_hashed_password(TEST_USER_PASSWORD),
        active_account=TEST_ACCOUNT_ID,
        role=TEST_USER_ROLE,
        user_icon=None
    )

def _create_account(user: str):
    return Account(
        _id=TEST_ACCOUNT_ID,
        account_name=TEST_ACCOUNT_NAME,
        account_number=TEST_ACCOUNT_NUMBER,
        type=TEST_ACCOUNT_TYPE,
        blockades=TEST_ACCOUNT_BLOCKADES,
        balance=TEST_ACCOUNT_BALANCE,
        currency=TEST_ACCOUNT_CURRENCY,
        user=bson.ObjectId(user)
    )