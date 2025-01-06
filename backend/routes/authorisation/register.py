from flask import Response, request
from flask_login import current_user

from routes.authorisation.helpers import validate_login_data
from routes.helpers import create_simple_response, hash_password
from users import UserRepository, User
from users.user_dto import UserDto
from users.user_response import UserResponse

user_repository = UserRepository()

def register() -> tuple[Response, int]:
    """
        POST /api/register
        ---
        summary: Register a new user.
        description: Creates a new user in the system if the email is not already in use.
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
                    description: The email of the new user.
                  password:
                    type: string
                    description: The password of the new user.
              example:
                email: "newuser@example.com"
                password: "securepassword123"
        responses:
          201:
            description: User successfully registered.
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
            description: Validation error in the registration data.
          409:
            description: User with the given email already exists, or user is already logged in.
    """
    if current_user.is_authenticated:
        return create_simple_response("alreadyLogged", 409)

    data = request.get_json()

    error = validate_login_data(data)
    if error:
        return create_simple_response(error, 400)

    if user_repository.find_by_email(data['email']):
        return create_simple_response("userExist", 409)

    user = User(
        login=data['email'],
        email=data['email'],
        password=hash_password(data['password']),
        active_account=None,
        role='USER',
        user_icon=None
    )
    user = user_repository.insert(user)

    user_dto = UserDto.from_user(user)
    return UserResponse.create_response("registerSuccessful", user_dto.to_dict(), 201)