from backend.tests.cyclic_payment.constants import DEFAULT_CYCLIC_PAYMENT, INVALID_CYCLIC_PAYMENT


def get_cyclic_payment(overrides=None):
    cyclic_payment_data = DEFAULT_CYCLIC_PAYMENT.copy()
    if overrides:
        cyclic_payment_data.update(overrides)
    return cyclic_payment_data

def get_cyclic_payment_not_valid():
    return INVALID_CYCLIC_PAYMENT
