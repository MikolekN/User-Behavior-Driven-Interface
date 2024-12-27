export const enum AccessLevels {
    All,
    Unauthorised,
    Authorised,
    Admin
}

type MenuOptionWithPath = {
    key: string;
    path: string;
    accessLevel: AccessLevels;
};

export type MenuOptionWithSubmenu = {
    key: string;
    accessLevel: AccessLevels;
    submenu: { key: string; path: string }[];
};

export type MenuOption = MenuOptionWithPath | MenuOptionWithSubmenu;

export const menuOptions: MenuOption[] = [
    { key: 'home', path: '/', accessLevel: AccessLevels.All },
    { key: 'login', path: '/login', accessLevel: AccessLevels.Unauthorised },
    { key: 'register', path: '/register', accessLevel: AccessLevels.Unauthorised },
    {
        key: 'transfers',
        accessLevel: AccessLevels.Authorised,
        submenu: [
            { key: 'transfer', path: '/transfer' },
            { key: 'transferHistory', path: '/transactions/history' },
            { key: 'cyclicPayments', path: '/cyclic-payments' },
            { key: 'loan', path: '/loan' },
        ]
    },
    {
        key: 'analysis',
        accessLevel: AccessLevels.Authorised,
        submenu: [
            { key: 'monthlyAnalysis', path: '/transactions/analysis/monthly' },
            { key: 'yearlyAnalysis', path: '/transactions/analysis/yearly' },
        ]
    },
    {
        key: 'myProducts',
        accessLevel: AccessLevels.Authorised,
        submenu: [
            { key: 'accounts', path: '/accounts' },
            { key: 'cards', path: '/cards' }
        ]
    },
    {
        key: 'customerService',
        accessLevel: AccessLevels.Authorised,
        submenu: [
            { key: 'chat', path: '/chat' },
            { key: 'faq', path: '/faq' },
            { key: 'info', path: '/info' },
        ]
    },
    { key: 'adminPanel', path: '/admin-panel', accessLevel: AccessLevels.Admin },
]
