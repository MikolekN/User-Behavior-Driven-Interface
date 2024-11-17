export const enum AccessLevels {
    All,
    Unauthorised,
    Authorised,
    Admin
}

export const menuOptions = [
    { label: 'Start', path: '/', accessLevel: AccessLevels.All },
    { label: 'Login', path: '/login', accessLevel: AccessLevels.Unauthorised },
    { label: 'Register', path: '/register', accessLevel: AccessLevels.Unauthorised },
    { 
        label: 'Przelewy',
        accessLevel: AccessLevels.Authorised,
        submenu: [
            { label: 'Wykonaj przelew', path: '/transfer' },
            { label: 'Historia przelewów', path: '/transactions/history' },
            { label: 'Płatności cykliczne', path: '/cyclic-payments' },
            { label: 'Pożyczki', path: '/loan' },
        ]
    },
    { 
        label: 'Finanse',
        accessLevel: AccessLevels.Authorised,
        submenu: [
            { label: 'Analizy miesięczne', path: '/transactions/analysis/monthly' },
            { label: 'Analizy roczne', path: '/transactions/analysis/yearly' },
        ]
    },
    { 
        label: 'Obsługa klienta',
        accessLevel: AccessLevels.Authorised,
        submenu: [
            { label: 'Czat', path: '/chat' },
            { label: 'Najczęściej zadawane pytania', path: '/faq' },
            { label: 'Kontakt', path: '/info' },
        ]
    },
    { label: 'Panel administratora', path: '/admin-panel', accessLevel: AccessLevels.Admin },
]
