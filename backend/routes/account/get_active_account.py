from flask import Response
from flask_login import login_required, current_user

from accounts import Account, AccountRepository
from accounts.account_dto import AccountDto
from accounts.account_response import AccountResponse
from routes.helpers import create_simple_response
from users import User, UserRepository

user_repository = UserRepository()
account_repository = AccountRepository()

@login_required
def get_active_account() -> tuple[Response, int]:
    """
        GET /api/accounts/active
        ---
        summary: Get the user's active account.
        description: Returns the details of the currently active account for the authenticated user.
        tags:
          - Account Management
        responses:
          200:
            description: Active account fetched successfully.
            content:
              application/json:
                schema:
                  type: object
                  properties:
                    message:
                      type: string
                    account:
                      type: object
          404:
            description: Active account does not exist.
            content:
              application/json:
                schema:
                  type: object
                  properties:
                    message:
                      type: string
    """
    user: User = user_repository.find_by_id(current_user._id)

    account: Account = account_repository.find_by_id(str(user.active_account))
    if not account:
        return create_simple_response("accountNotExist", 404)

    account_dto = AccountDto.from_account(account)
    return AccountResponse.create_response("accountFetchSuccessful", account_dto.to_dict(), 200)