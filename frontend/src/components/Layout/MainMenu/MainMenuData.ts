import { MAIN_MENU } from "../../../event/utils/constants";


export const enum AccessLevels {
    All,
    Unauthorised,
    Authorised,
    Admin
}

type MenuOptionWithPath = {
    id: string;
    key: string;
    path: string;
    accessLevel: AccessLevels;
};

export type MenuOptionWithSubmenu = {
    id: string;
    key: string;
    accessLevel: AccessLevels;
    submenu: { id: string, key: string; path: string }[];
};

export type MenuOption = MenuOptionWithPath | MenuOptionWithSubmenu;

export const menuOptions: MenuOption[] = [
    { id: MAIN_MENU.MENU_HOME.id, key: 'home', path: '/', accessLevel: AccessLevels.All },
    { id: MAIN_MENU.MENU_LOGIN.id, key: 'login', path: '/login', accessLevel: AccessLevels.Unauthorised },
    { id: MAIN_MENU.MENU_REGISTER.id, key: 'register', path: '/register', accessLevel: AccessLevels.Unauthorised },
    {
        id: MAIN_MENU.MENU_TRANSFERS.id,
        key: 'transfers',
        accessLevel: AccessLevels.Authorised,
        submenu: [
            { id: MAIN_MENU.SUBMENU_TRANSFER.id, key: 'transfer', path: '/transfer' },
            { id: MAIN_MENU.SUBMENU_TRANSFER_HISTORY.id, key: 'transferHistory', path: '/transactions/history' },
            { id: MAIN_MENU.SUBMENU_CYCLIC_PAYMENTS.id, key: 'cyclicPayments', path: '/cyclic-payments' },
            { id: MAIN_MENU.SUBMENU_LOAN.id, key: 'loan', path: '/loan' },
        ]
    },
    {
        id: MAIN_MENU.MENU_ANALYSIS.id,
        key: 'analysis',
        accessLevel: AccessLevels.Authorised,
        submenu: [
            { id: MAIN_MENU.SUBMENU_MONTHLY_ANALYSIS.id, key: 'monthlyAnalysis', path: '/transactions/analysis/monthly' },
            { id: MAIN_MENU.SUBMENU_YEARLY_ANALYSIS.id, key: 'yearlyAnalysis', path: '/transactions/analysis/yearly' },
        ]
    },
    {
        id: MAIN_MENU.MENU_MY_PRODUCTS.id,
        key: 'myProducts',
        accessLevel: AccessLevels.Authorised,
        submenu: [
            { id: MAIN_MENU.SUBMENU_ACCOUNTS.id, key: 'accounts', path: '/accounts' },
            { id: MAIN_MENU.SUBMENU_CARDS.id, key: 'cards', path: '/cards' }
        ]
    },
    {
        id: MAIN_MENU.MENU_MY_PRODUCTS.id,
        key: 'customerService',
        accessLevel: AccessLevels.Authorised,
        submenu: [
            { id: MAIN_MENU.SUBMENU_CHAT.id, key: 'chat', path: '/chat' },
            { id: MAIN_MENU.SUBMENU_FAQ.id, key: 'faq', path: '/faq' },
            { id: MAIN_MENU.SUBMENU_INFO.id, key: 'info', path: '/info' },
        ]
    },
    { id: MAIN_MENU.MENU_ADMIN_PANEL.id,  key: 'adminPanel', path: '/admin-panel', accessLevel: AccessLevels.Admin },
]
