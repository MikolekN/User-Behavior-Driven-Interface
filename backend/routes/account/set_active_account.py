from flask import Response
from flask_login import login_required, current_user

from accounts import AccountRepository, Account
from routes.helpers import create_simple_response
from routes.transfer.helpers import prevent_unauthorised_account_access
from users import UserRepository, User

user_repository = UserRepository()
account_repository = AccountRepository()


@login_required
def set_active_account(account_number: str) -> tuple[Response, int]:
    """
        PUT /api/accounts/set_active/{account_number}
        ---
        summary: Set a specific account as the active account.
        description: Sets the specified account as the active account for the authenticated user.
        tags:
          - Account Management
        parameters:
          - name: account_number
            in: path
            required: true
            schema:
              type: string
            description: The account number to be set as active.
        responses:
          200:
            description: Active account set successfully.
            content:
              application/json:
                schema:
                  type: object
                  properties:
                    message:
                      type: string
          403:
            description: Unauthorized access to the account.
          404:
            description: Account or user does not exist.
    """
    account: Account = account_repository.find_by_account_number(account_number)
    if not account:
        return create_simple_response("accountNotExist", 404)

    if prevent_unauthorised_account_access(account):
        return create_simple_response("unauthorisedAccountAccess", 403)

    user: User = user_repository.find_by_id(current_user._id)
    if not user:
        return create_simple_response("userNotExist", 404)

    user.active_account = account.id
    user_repository.update(user.id, {'active_account': account.id})

    return create_simple_response("activeAccountSetSuccessful", 200)