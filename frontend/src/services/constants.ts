export const API_URL = 'http://127.0.0.1:5000/api';
export const DAY_LENGTH_IN_MILISECONDS = 86400000;

export const AVAILABLE_LOAN_LENGTH = [
    { loanLength: 6 },
    { loanLength: 12 },
    { loanLength: 24 },
    { loanLength: 36 },
    { loanLength: 48 }
];
export const MIN_LOAN_AMOUNT = 1000;
export const MAX_LOAN_AMOUNT = 100000;
export const LOAN_AMOUNT_STEP = 1000;

export const CHART_HEIGHT: number = 400;
export const LEGEND_HEIGHT: number = 30;
export const COLORS = {
    RED: '#ee0000',
    GREEN: '#00d800'
};

export const INTERVAL_OPTIONS = [
    { value: 'Every 7 days', label: 'Every 7 days' },
    { value: 'Every month', label: 'Every month' },
    { value: 'Every 3 months', label: 'Every 3 months' },
    { value: 'Every 6 months', label: 'Every 6 months' }
];

export const VALID_FIELDS = [
    { value: 'login', label: 'Nazwa użytkownika' },
    { value: 'account_name', label: 'Nazwa konta' },
    { value: 'currency', label: 'Waluta' }
];

export const TRANSFER_SUBMENU_OPTIONS = [
    { label: 'Wykonaj przelew', path: '/transfer' },
    { label: 'Historia przelewów', path: '/transactions/history' },
    { label: 'Płatności cykliczne', path: '/cyclic-payments' },
    { label: 'Pożyczki', path: '/loan' },
];

export const SETTINGS_SUBMENU_OPTIONS = [
    { label: 'Ustawienia1', path: '/' },
    { label: 'Ustawienia2', path: '/' },
];

export const FINANCES_SUBMENU_OPTIONS = [
    { label: 'Analizy miesięczne', path: '/transactions/analysis/monthly' },
    { label: 'Analizy roczne', path: '/transactions/analysis/yearly' },
];

export const CUSTOMER_SERVICE_SUBMENU_OPTIONS = [
    { label: 'Czat', path: '/chat' },
    { label: 'Najczęściej zadawane pytania', path: '/faq' },
    { label: 'Kontakt', path: '/info' },
];
