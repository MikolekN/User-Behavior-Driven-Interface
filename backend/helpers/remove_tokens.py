from shared import TokenRepository


def remove_tokens():
    token_repository = TokenRepository()
    token_repository.drop_collection()