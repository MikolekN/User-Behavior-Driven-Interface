import bson


def generate_token():
    return str(bson.ObjectId())