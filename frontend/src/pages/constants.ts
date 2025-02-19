import poland from '../assets/images/poland.png';
import uk from '../assets/images/united-kingdom.png';

export const HOST_URL = 'http://localhost:5173';

export const AVAILABLE_LOAN_LENGTH = [
    { loanLength: '6' },
    { loanLength: '12' },
    { loanLength: '24' },
    { loanLength: '36' },
    { loanLength: '48' }
];
export const MIN_LOAN_AMOUNT = 1000;
export const MAX_LOAN_AMOUNT = 100000;
export const LOAN_AMOUNT_STEP = 1000;
export const MIN_LOAN_AMOUNT_TEXT = '1 000';
export const MAX_LOAN_AMOUNT_TEXT = '100 000';

export const FIELD_SELECT_OPTIONS = [
    { value: 'login', key: 'userName' }
];

export const INTERVAL_SELECT_OPTIONS = [
    { value: 'week', key: 'week' },
    { value: 'month', key: 'month' },
    { value: 'quarter', key: 'quarter' },
    { value: 'halfYear', key: 'halfYear' }
];

export const ACCOUNT_TYPE_SELECT_OPTIONS = [
    { value: 'personal', key: 'personalAccount' },
    { value: 'savings', key: 'savingsAccount' },
    { value: 'currency', key: 'currencyAccount' },
    { value: 'business', key: 'businessAccount' },
    { value: 'youth', key: 'youthAccount' },
    { value: 'student', key: 'studentAccount' },
    { value: 'retirement', key: 'retirementAccount' }
]

export const LANGUAGES = [
    {
        key: "english",
        value: "en",
        image: uk
    },
    {
        key: "polish",
        value: "pl",
        image: poland
    }
];
