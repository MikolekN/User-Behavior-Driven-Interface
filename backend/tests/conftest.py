from datetime import datetime

import bcrypt
import pytest

import application
from cyclic_payments import CyclicPayment
from tests.constants import TEST_PASSWORD, TEST_ID, TEST_EMAIL
from tests.cyclic_payment.constants import TEST_ISSUER_ACCOUNT_NUMBER, TEST_CYCLIC_PAYMENT_NAME, TEST_AMOUNT, \
    TEST_CYCLIC_PAYMENT_TRANSFER_TITLE, TEST_CYCLIC_PAYMENT_START_DATE, TEST_CYCLIC_PAYMENT_INTERVAL
from tests.transfer.constants import TEST_RECIPIENT_ACCOUNT_NUMBER, TEST_TRANSFER_TITLE
from transfers import Transfer
from users import User


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

@pytest.fixture
def create_user():
    def _create_user(login, email, account_number):
        return User(
            _id=TEST_ID,
            login=login,
            email=email,
            password=generate_hashed_password(TEST_PASSWORD),
            account_name="Test Account",
            account_number=account_number,
            blockades=0.0,
            balance=2000.0,
            currency="PLN",
            user_icon=None,
            role="USER"
        )
    return _create_user

@pytest.fixture
def test_user(create_user):
    yield create_user("testuser", TEST_EMAIL, "1234567890")

@pytest.fixture
def test_recipient_user(create_user):
    yield create_user("test_recipient_user", TEST_EMAIL, TEST_RECIPIENT_ACCOUNT_NUMBER)

@pytest.fixture
def test_issuer_user(create_user):
    yield create_user("test_issuer_user", TEST_EMAIL, TEST_ISSUER_ACCOUNT_NUMBER)

@pytest.fixture
def test_cyclic_payment():
    yield CyclicPayment(
        issuer_id=TEST_ID, recipient_id=TEST_ID,
        recipient_account_number=TEST_RECIPIENT_ACCOUNT_NUMBER, recipient_name="test name",
        cyclic_payment_name=TEST_CYCLIC_PAYMENT_NAME, transfer_title=TEST_CYCLIC_PAYMENT_TRANSFER_TITLE,
        amount=float(TEST_AMOUNT), start_date=datetime.fromisoformat(TEST_CYCLIC_PAYMENT_START_DATE),
        interval=TEST_CYCLIC_PAYMENT_INTERVAL
    )

def create_transfer(title, amount):
    return Transfer(
        created=datetime.now(),
        transfer_from_id=TEST_ID,
        transfer_to_id=TEST_ID,
        title=title,
        amount=amount
    )

@pytest.fixture
def test_transfers():
    yield [create_transfer(TEST_TRANSFER_TITLE, TEST_AMOUNT) for _ in range(3)]

@pytest.fixture
def test_transfers_for_analysis():
    yield [create_transfer(TEST_TRANSFER_TITLE, float(TEST_AMOUNT)) for _ in range(3)]
