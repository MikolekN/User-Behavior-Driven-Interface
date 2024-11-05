
from backend.tests.transfer.constants import DEFAULT_TRANSFER, INVALID_TRANSFER


def get_transfer(overrides=None):
    cyclic_payment_data = DEFAULT_TRANSFER.copy()
    if overrides:
        cyclic_payment_data.update(overrides)
    return cyclic_payment_data

def get_transfer_not_valid():
    return INVALID_TRANSFER
