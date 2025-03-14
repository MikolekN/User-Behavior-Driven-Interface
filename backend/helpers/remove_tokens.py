from shared import TokenRepository


def remove_tokens():
    token_repository = TokenRepository()
    tokens = token_repository.find_many({})
    if tokens:
        for token in tokens:
            token_repository.delete(str(token.id))