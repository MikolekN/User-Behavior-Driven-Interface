from flask import Response, request
from flask_login import current_user, login_user

from routes.authorisation.helpers import validate_login_data, authenticate_user
from routes.helpers import create_simple_response
from users.user_dto import UserDto
from users.user_response import UserResponse


def login() -> tuple[Response, int]:
    """
        POST /api/login
        ---
        summary: Log in an existing user.
        description: Authenticates a user based on email and password. Returns a message and user data if successful.
        tags:
          - Authentication
        requestBody:
          required: true
          content:
            application/json:
              schema:
                type: object
                properties:
                  email:
                    type: string
                    description: The email of the user.
                  password:
                    type: string
                    description: The password of the user.
              example:
                email: "example@example.com"
                password: "123456"
        responses:
          200:
            description: Successfully logged in.
            content:
              application/json:
                schema:
                  type: object
                  properties:
                    message:
                      type: string
                    user:
                      type: object
          400:
            description: Validation error in the login data.
          401:
            description: Unauthorized - Invalid credentials.
          404:
            description: User with the given email does not exist.
          409:
            description: User is already logged in.
    """
    if current_user.is_authenticated:
        return create_simple_response("alreadyLogged", 409)

    data = request.get_json()

    error = validate_login_data(data)
    if error:
        return create_simple_response(error, 400)

    user, error, status_code = authenticate_user(data['email'], data['password'])
    if user is None:
        return create_simple_response(error, status_code)

    login_user(user)
    user_dto = UserDto.from_user(user)
    return UserResponse.create_response("loginSuccessful", user_dto.to_dict(), 200)