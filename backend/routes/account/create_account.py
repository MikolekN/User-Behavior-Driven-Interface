from flask import Response, request
from flask_login import login_required, current_user

from accounts import AccountRepository, Account
from routes.account.helpers import validate_create_account_data, generate_account_number
from routes.helpers import create_simple_response
from users import UserRepository, User

user_repository = UserRepository()
account_repository = AccountRepository()


@login_required
def create_account() -> tuple[Response, int]:
    """
        POST /api/accounts/
        ---
        summary: Create a new account.
        description: Creates a new account for the authenticated user.
        tags:
          - Account Management
        requestBody:
          required: true
          content:
            application/json:
              schema:
                type: object
                properties:
                  account_name:
                    type: string
                    description: The name of the account to create.
                  account_type:
                    type: string
                    description: The type of the account (must be valid).
                  currency:
                    type: string
                    description: The currency used by the account (e.g., USD, EUR).
                required:
                  - account_name
                  - account_type
                  - currency
                example:
                  account_name: "Savings Account"
                  account_type: "SAVINGS"
                  currency: "USD"
        responses:
          201:
            description: Account created successfully.
            content:
              application/json:
                schema:
                  type: object
                  properties:
                    message:
                      type: string
          400:
            description: Account creation validation failed.
            content:
              application/json:
                schema:
                  type: object
                  properties:
                    message:
                      type: string
    """
    data = request.get_json()

    error = validate_create_account_data(data)
    if error:
        return create_simple_response(error, 400)

    user: User = user_repository.find_by_id(current_user._id)
    account: Account = Account(
        account_name=data['account_name'],
        account_number=generate_account_number(),
        type=data['account_type'],
        blockades=0,
        balance=0,
        currency=data['currency'],
        user=user.id
    )
    account_repository.insert(account)

    return create_simple_response("accountCreatedSuccessfully", 201)