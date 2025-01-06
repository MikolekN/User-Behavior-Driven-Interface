from flask import Response
from flask_login import login_required, logout_user

from routes.helpers import create_simple_response


@login_required
def logout() -> tuple[Response, int]:
    """
        POST /api/logout
        ---
        summary: Log out the current user.
        description: Logs out the currently authenticated user.
        tags:
          - Authentication
        responses:
          200:
            description: Successfully logged out.
            content:
              application/json:
                schema:
                  type: object
                  properties:
                    message:
                      type: string
          401:
            description: Unauthorized - User is not logged in.
    """
    logout_user()
    return create_simple_response("logoutSuccessful", 200)