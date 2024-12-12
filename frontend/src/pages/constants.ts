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
    { value: 'login', key: 'userName' },
    { value: 'accountName', key: 'accountName' },
    { value: 'currency', key: 'currency' }
];

export const INTERVAL_SELECT_OPTIONS = [
    { value: 'Every 7 days', key: 'week' },
    { value: 'Every month', key: 'month' },
    { value: 'Every 3 months', key: 'quarter' },
    { value: 'Every 6 months', key: 'halfYear' }
];

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
