import pytest

import application
from accounts.account_dto import AccountDto
from tests.constants import TEST_USER_LOGIN, TEST_USER_EMAIL, TEST_USER_ID, TEST_DIFFERENT_USER_ID
from users.user_dto import UserDto
from utils import _create_user, _create_account, _create_transfer, _create_cyclic_payment


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
    yield [_create_account(user=TEST_USER_ID) for _ in range(3)]

# --- Transfer fixtures --- #
@pytest.fixture
def test_transfer():
    yield _create_transfer()

@pytest.fixture
def test_unauthorised_transfer():
    yield _create_transfer()

@pytest.fixture
def test_transfers():
    yield [_create_transfer() for _ in range(3)]

# --- Cyclic payment fixtures --- #
@pytest.fixture
def test_cyclic_payment():
    yield _create_cyclic_payment()

@pytest.fixture
def test_cyclic_payments():
    yield [_create_cyclic_payment() for _ in range(3)]
