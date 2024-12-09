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

export const LANGUAGES = [
    {
        name: "English",
        code: "en",
        image: uk
    },
    {
        name: "Polish",
        code: "pl",
        image: poland
    }
];
