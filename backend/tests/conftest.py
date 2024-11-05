from datetime import datetime
from backend.cyclic_payments.cyclic_payment import CyclicPayment
from backend.tests.transfer.constants import TEST_TRANSFER_TITLE
from backend.transfers.transfer import Transfer
from backend.users.user import User
import bcrypt
import pytest
from ..application import create_app
from backend.tests.constants import TEST_EMAIL, TEST_ID, TEST_PASSWORD
from backend.tests.cyclic_payment.constants import TEST_AMOUNT, TEST_CYCLIC_PAYMENT_INTERVAL, TEST_CYCLIC_PAYMENT_NAME, TEST_CYCLIC_PAYMENT_START_DATE, TEST_CYCLIC_PAYMENT_TRANSFER_TITLE, TEST_ISSUER_ACCOUNT_NUMBER, TEST_RECIPIENT_ACCOUNT_NUMBER

@pytest.fixture
def app():
    app = create_app()
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
def test_user():
    hashed_password = bcrypt.hashpw(TEST_PASSWORD.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    yield User(
        _id=TEST_ID,
        login="testuser",
        email=TEST_EMAIL,
        password=hashed_password,
        account_name="Test Account",
        account_number="1234567890",
        blockades=0.0,
        balance=2000.0,
        currency="PLN",
        user_icon=None,
        role="USER"
    )

@pytest.fixture
def test_recipient_user():
    hashed_password = bcrypt.hashpw(TEST_PASSWORD.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    yield User(
        _id=TEST_ID,
        login="test_recipient_user",
        email=TEST_EMAIL,
        password=hashed_password,
        account_name="Test Account",
        account_number=TEST_RECIPIENT_ACCOUNT_NUMBER,
        blockades=0.0,
        balance=2000.0,
        currency="PLN",
        user_icon=None,
        role="USER"
    )

@pytest.fixture
def test_issuer_user():
    hashed_password = bcrypt.hashpw(TEST_PASSWORD.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    yield User(
        _id=TEST_ID,
        login="test_issuer_user",
        email=TEST_EMAIL,
        password=hashed_password,
        account_name="Test Account",
        account_number=TEST_ISSUER_ACCOUNT_NUMBER,
        blockades=0.0,
        balance=2000.0,
        currency="PLN",
        user_icon=None,
        role="USER"
    )

@pytest.fixture
def test_cyclic_payment():
    yield CyclicPayment(
        issuer_id=TEST_ID, recipient_id=TEST_ID, 
        recipient_account_number=TEST_RECIPIENT_ACCOUNT_NUMBER, recipient_name="test name",
        cyclic_payment_name=TEST_CYCLIC_PAYMENT_NAME, transfer_title=TEST_CYCLIC_PAYMENT_TRANSFER_TITLE, 
        amount=float(TEST_AMOUNT), start_date=datetime.fromisoformat(TEST_CYCLIC_PAYMENT_START_DATE), 
        interval=TEST_CYCLIC_PAYMENT_INTERVAL
    )

@pytest.fixture
def test_transfers():
    transfers = []
    transfer = Transfer(
        created=datetime.now(), 
        transfer_from_id=TEST_ID,
        transfer_to_id=TEST_ID, 
        title=TEST_TRANSFER_TITLE, 
        amount=TEST_AMOUNT
    )

    transfers.append(transfer)
    transfers.append(transfer)
    transfers.append(transfer)

    yield transfers

@pytest.fixture
def test_transfers_for_analysis():
    transfers = []
    transfer = Transfer(
        created=datetime.now(), 
        transfer_from_id=TEST_ID,
        transfer_to_id=TEST_ID, 
        title=TEST_TRANSFER_TITLE, 
        amount=float(TEST_AMOUNT)
    )

    transfers.append(transfer)
    transfers.append(transfer)
    transfers.append(transfer)

    yield transfers
