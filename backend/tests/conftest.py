import pytest

import application
from accounts.account_dto import AccountDto
from tests.constants import TEST_USER_LOGIN, TEST_USER_EMAIL, TEST_USER_ID, TEST_DIFFERENT_USER_ID, TEST_USER_PASSWORD, TEST_ACCOUNT_NAME, TEST_ACCOUNT_CURRENCY, TEST_ACCOUNT_TYPE
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

#region # --- User fixtures --- #
@pytest.fixture
def test_user():
    yield _create_user(TEST_USER_LOGIN, TEST_USER_EMAIL)

@pytest.fixture
def test_user_dto(test_user):
    yield UserDto.from_user(test_user)

@pytest.fixture
def valid_user_data():
    return {'email': TEST_USER_EMAIL, 'password': TEST_USER_PASSWORD}

@pytest.fixture
def wrong_password_user_data():
    return {'email': TEST_USER_EMAIL, 'password': "WrongPassword123"}

def empty_user_data():
    return {}

def missing_email_user_data():
    return {'password': TEST_USER_PASSWORD}

def missing_password_user_data():
    return {'email': TEST_USER_EMAIL}

def invalid_email_user_data():
    return {'email': 0, 'password': TEST_USER_PASSWORD}

def invalid_password_user_data():
    return {'email': TEST_USER_EMAIL, 'password': 0}

def empty_email_user_data():
    return {'email': "", 'password': TEST_USER_PASSWORD}

def empty_password_user_data():
    return {'email': TEST_USER_EMAIL, 'password': ""}
# TODO: get the rest of the possible errors
#endregion

#region # --- Account fixtures --- #
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
def valid_account_data():
    return {'account_name': TEST_ACCOUNT_NAME, 'type': TEST_ACCOUNT_TYPE, 'currency': TEST_ACCOUNT_CURRENCY}

@pytest.fixture
def test_accounts():
    yield [_create_account(user=TEST_USER_ID) for _ in range(3)]

def empty_account_data():
    return {}

def invalid_account_data():
    return "invalid_account_data"

def missing_fields_user_data():
    return {'hallo': "hallo"}

def extra_fields_user_data():
    return {
        'account_name': TEST_ACCOUNT_NAME,
        'type': TEST_ACCOUNT_TYPE,
        'currency': TEST_ACCOUNT_CURRENCY,
        'hallo': "hallo"
    }

def invalid_fields_user_data():
    return {
        'account_name': 0,
        'type': 0,
        'currency': 0
    }

def empty_fields_user_data():
    return {
        'account_name': "",
        'type': "",
        'currency': ""
    }

def invalid_currency_format_user_data():
    return {
        'account_name': TEST_ACCOUNT_NAME,
        'type': TEST_ACCOUNT_TYPE,
        'currency': 'hallo',
    }

def invalid_account_type_user_data():
    return {
        'account_name': TEST_ACCOUNT_NAME,
        'type': 'hallo',
        'currency': TEST_ACCOUNT_CURRENCY,
    }

def invalid_account_number():
    return 0

def wrong_length_account_number():
    return "0"

def non_digit_account_number():
    return "0000000000000000000000000a"


#endregion

#region # --- Transfer fixtures --- #
@pytest.fixture
def test_transfer():
    yield _create_transfer()

@pytest.fixture
def test_unauthorised_transfer():
    yield _create_transfer()

@pytest.fixture
def test_transfers():
    yield [_create_transfer() for _ in range(3)]
#endregion

#region # --- Cyclic payment fixtures --- #
@pytest.fixture
def test_cyclic_payment():
    yield _create_cyclic_payment()

@pytest.fixture
def test_cyclic_payments():
    yield [_create_cyclic_payment() for _ in range(3)]
#endregion