from flask import Response
from flask_login import login_required

from accounts import Account, AccountRepository
from accounts.account_dto import AccountDto
from accounts.account_response import AccountResponse
from routes.helpers import create_simple_response

account_repository = AccountRepository()

@login_required
def get_account(account_number) -> tuple[Response, int]:
    """
        GET /api/accounts/{account_number}
        ---
        summary: Get a specific account by account number.
        description: Returns the details of the specified account.
        tags:
          - Account Management
        parameters:
          - name: account_number
            in: path
            required: true
            schema:
              type: string
            description: The account number of the account to retrieve.
        responses:
          200:
            description: Account fetched successfully.
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
            description: Account does not exist.
            content:
              application/json:
                schema:
                  type: object
                  properties:
                    message:
                      type: string
    """
    account: Account = account_repository.find_by_account_number(account_number)
    if not account:
        return create_simple_response("accountNotExist", 404)

    account_dto = AccountDto.from_account(account)
    return AccountResponse.create_response("accountFetchSuccessful", account_dto.to_dict(), 200)