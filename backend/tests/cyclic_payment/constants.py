TEST_AVAILABLE_USER_FUNDS = 1000
TEST_CYCLIC_PAYMENT_NAME = "cyclicPaymentName"
TEST_RECIPIENT_ACCOUNT_NUMBER = "00000000000000000000000000"
TEST_ISSUER_ACCOUNT_NUMBER = "11111111111111111111111111"
TEST_CYCLIC_PAYMENT_TRANSFER_TITLE = "transferTitle"
TEST_AMOUNT = "5"
TEST_NEGATIVE_AMOUNT = "-5"
TEST_NOT_ENOUGH_USER_FUNDS = 0
TEST_BIG_AMOUNT = 1000
TEST_CYCLIC_PAYMENT_START_DATE = "2024-09-22T10:06:51.801Z"
TEST_CYCLIC_PAYMENT_INTERVAL = "Every 7 days"

DEFAULT_CYCLIC_PAYMENT = {
    'cyclicPaymentName': TEST_CYCLIC_PAYMENT_NAME,
    'recipientAccountNumber': TEST_RECIPIENT_ACCOUNT_NUMBER,
    'transferTitle': TEST_CYCLIC_PAYMENT_TRANSFER_TITLE,
    'amount': TEST_AMOUNT,
    'startDate': TEST_CYCLIC_PAYMENT_START_DATE,
    'interval': TEST_CYCLIC_PAYMENT_INTERVAL
}

INVALID_CYCLIC_PAYMENT = {
    'cyclicPaymentName': TEST_CYCLIC_PAYMENT_NAME,
    'recipientAccountNumber': TEST_RECIPIENT_ACCOUNT_NUMBER,
    'transferTitle': TEST_CYCLIC_PAYMENT_TRANSFER_TITLE,
    'amount': TEST_AMOUNT,
    'startDate': TEST_CYCLIC_PAYMENT_START_DATE
}

TEST_CYCLIC_PAYMENT_ID = "67265c4eb1159c5e10b7c903"
TEST_CYCLIC_PAYMENT_INVALID_ID = "67265c4eb1159c5e10b7c90g"
