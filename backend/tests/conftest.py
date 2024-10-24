from backend.users.user import User
import bcrypt
import pytest
from ..application import create_app
from flask_login import login_user
from .constants import TEST_EMAIL, TEST_PASSWORD

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
    
    test_user = User(
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
    
    yield test_user 
