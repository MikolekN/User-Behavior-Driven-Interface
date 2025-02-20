from datetime import datetime

import bson

from users import User

user_data_in_db = {
    "_id": bson.ObjectId("65d4f1e5b2e68d4d8a3f5b7c"),
    "created": datetime.now(),
    "is_deleted": False,
    "login": "test_user",
    "email": "test@example.com",
    "password": "securepassword",
    "active_account": bson.ObjectId("65d4f1e5b2e68d4d8a3f5b7d"),
    "user_icon": "avatar.png",
    "role": "admin"
}

user = User.from_dict(user_data_in_db)
print(f"user: {user}")

user_data = user.to_dict()
print(f"user_data: {user_data}")

user_data_serialized = user.to_serialized_dict()
print(f"user_data_serialized: {user_data_serialized}")