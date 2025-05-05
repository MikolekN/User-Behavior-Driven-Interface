PAGE_TRANSITION_PREFERENCES_EDIT_MAPPINGS = {
    "/edit-cyclic-payment": "/cyclic-payments",
    "/edit-account": "/accounts",
    "/edit-card": "/cards"
}

MAX_PAGE_TRANSITION_PREFERENCES_LINKS = 4

BASE_QUICK_ICONS_PREFERENCE = 'quick-icons-settings'

AUTO_REDIRECT_TIME_SPENT_THRESHOLD = 10000 # 10s in ms
DEFAULT_AUTO_REDIRECT_URL = "/dashboard"
DEFAULT_AUTO_REDIRECT_PREFERENCE = {
    "accountForm": DEFAULT_AUTO_REDIRECT_URL,
    "accountFormEdit": DEFAULT_AUTO_REDIRECT_URL,
    "cardForm": DEFAULT_AUTO_REDIRECT_URL,
    "cardFormEdit": DEFAULT_AUTO_REDIRECT_URL,
    "cyclicPaymentForm": DEFAULT_AUTO_REDIRECT_URL,
    "cyclicPaymentFormEdit": DEFAULT_AUTO_REDIRECT_URL,
    "loanForm": DEFAULT_AUTO_REDIRECT_URL,
    "transferForm": DEFAULT_AUTO_REDIRECT_URL
}

FORM_SUBMIT_CLICK_EVENT_ELEMENT_IDS = ["account-form", "account-form-edit", "card-form", "card-form-edit",
                                       "cyclic-payment-form", "cyclic-payment-form-edit", "loan-form", "transfer-form"]
