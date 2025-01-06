import bcrypt
import pytest

import application
from accounts import Account
from tests.constants import TEST_USER_LOGIN, TEST_USER_EMAIL, TEST_USER_ID, TEST_USER_PASSWORD, TEST_ACCOUNT_ID, \
    TEST_USER_ROLE, TEST_ACCOUNT_CURRENCY, TEST_ACCOUNT_BALANCE, TEST_ACCOUNT_BLOCKADES, TEST_ACCOUNT_TYPE, \
    TEST_ACCOUNT_NUMBER, TEST_ACCOUNT_NAME
from users import User
from users.user_dto import UserDto


def generate_hashed_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')


@pytest.fixture
def app():
    app = application.create_app()
    app.config.update({"TESTING": True})
    yield app

@pytest.fixture
def client(app):
    with app.test_client() as client:
        yield client

@pytest.fixture
def runner(app):
    with app.test_cli_runner() as runner:
        yield runner

# --- User fixtures --- #
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

@pytest.fixture
def test_user():
    yield _create_user(TEST_USER_LOGIN, TEST_USER_EMAIL)

@pytest.fixture
def test_user_dto(test_user):
    yield UserDto.from_user(test_user)

# --- Account fixtures --- #
def _create_account():
    return Account(
        _id=TEST_ACCOUNT_ID,
        account_name=TEST_ACCOUNT_NAME,
        account_number=TEST_ACCOUNT_NUMBER,
        type=TEST_ACCOUNT_TYPE,
        blockades=TEST_ACCOUNT_BLOCKADES,
        balance=TEST_ACCOUNT_BALANCE,
        currency=TEST_ACCOUNT_CURRENCY,
        user=TEST_USER_ID
    )

@pytest.fixture
def test_account():
    yield _create_account()

# --- Transfer fixtures --- #
# @pytest.fixture
# def test_cyclic_payment():
#     yield CyclicPayment(
#         issuer_id=TEST_ID, recipient_id=TEST_ID,
#         recipient_account_number=TEST_RECIPIENT_ACCOUNT_NUMBER, recipient_name="test name",
#         cyclic_payment_name=TEST_CYCLIC_PAYMENT_NAME, transfer_title=TEST_CYCLIC_PAYMENT_TRANSFER_TITLE,
#         amount=float(TEST_AMOUNT), start_date=datetime.fromisoformat(TEST_CYCLIC_PAYMENT_START_DATE),
#         interval=TEST_CYCLIC_PAYMENT_INTERVAL
#     )
#
# def create_transfer(title, amount):
#     return Transfer(
#         created=datetime.now(),
#         transfer_from_id=TEST_ID,
#         transfer_to_id=TEST_ID,
#         title=title,
#         amount=amount
#     )
#
# @pytest.fixture
# def test_transfers():
#     yield [create_transfer(TEST_TRANSFER_TITLE, float(TEST_AMOUNT)) for _ in range(3)]

# --- Cyclic payment fixtures --- #
