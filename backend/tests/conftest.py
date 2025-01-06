import pytest

import application
from accounts.account_dto import AccountDto
from tests.constants import TEST_USER_LOGIN, TEST_USER_EMAIL, TEST_USER_ID, TEST_DIFFERENT_USER_ID
from users.user_dto import UserDto
from utils import _create_user, _create_account


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
@pytest.fixture
def test_user():
    yield _create_user(TEST_USER_LOGIN, TEST_USER_EMAIL)

@pytest.fixture
def test_user_dto(test_user):
    yield UserDto.from_user(test_user)

# --- Account fixtures --- #
@pytest.fixture
def test_account():
    yield _create_account(user=TEST_USER_ID)

@pytest.fixture
def test_unauthorised_account():
    yield _create_account(user=TEST_DIFFERENT_USER_ID)

@pytest.fixture
def test_account_dto(test_account):
    yield AccountDto.from_account(test_account)

@pytest.fixture
def test_accounts():
    yield [_create_account() for _ in range(3)]

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
