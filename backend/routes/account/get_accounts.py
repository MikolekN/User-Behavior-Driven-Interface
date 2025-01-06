from flask import Response
from flask_login import login_required, current_user

from accounts import AccountRepository, Account
from accounts.accounts_response import AccountsResponse
from routes.helpers import create_simple_response
from users import UserRepository, User

user_repository = UserRepository()
account_repository = AccountRepository()

@login_required
def get_accounts() -> tuple[Response, int]:
    """
        GET /api/accounts/
        ---
        summary: Get all accounts for the authenticated user.
        description: Returns a list of accounts associated with the authenticated user.
        tags:
          - Account Management
        responses:
          200:
            description: Accounts fetched successfully.
            content:
              application/json:
                schema:
                  type: object
                  properties:
                    message:
                      type: string
                    accounts:
                      type: array
                      items:
                        type: object
          404:
            description: No accounts exist for the user.
            content:
              application/json:
                schema:
                  type: object
                  properties:
                    message:
                      type: string
    """
    user: User = user_repository.find_by_id(current_user._id)

    accounts: list[Account] = account_repository.find_accounts(str(user.id))
    if not accounts:
        return create_simple_response("accountsNotExist", 404)

    accounts_dto = [account.to_dict() for account in accounts]

    return AccountsResponse.create_response("accountsFetchSuccessful", accounts_dto, 200)