export interface ElementInfo {
    id: string;
};

export const QUICK_ICONS: Record<string, ElementInfo> = {
    LANGUAGE_SELECTOR: { id: "quick-icons-language-selector" },
    THEME_TOGGLE: { id: "quick-icons-theme-toggle" },
    LOGIN: { id: "quick-icons-login" },
    LOGOUT: { id: "quick-icons-logout" },
    REGISTER: { id: "quick-icons-register" },
    SETTINGS: { id: "quick-icons-settings" },
    PROFILE: { id: "quick-icons-profile" },
} as const;
  
export const USER_DROPDOWN: Record<string, ElementInfo> = {
    LANGUAGE_SELECTOR: { id: "dropdown-language-selector" },
    THEME_TOGGLE: { id: "dropdown-theme-toggle" },
    LOGIN: { id: "dropdown-login" },
    LOGOUT: { id: "dropdown-logout" },
    REGISTER: { id: "dropdown-register" },
    SETTINGS: { id: "dropdown-settings" },
    PROFILE: { id: "dropdown-profile" },
} as const;
  
export const QUICK_ICONS_ELEMENTS: ElementInfo[] = Object.values(QUICK_ICONS);
export const USER_DROPDOWN_ELEMENTS: ElementInfo[] = Object.values(USER_DROPDOWN);
export const ALL_QUICK_ICONS_ELEMENTS: ElementInfo[] = QUICK_ICONS_ELEMENTS.concat(USER_DROPDOWN_ELEMENTS);

export const CLICK_EVENT_TYPE: string = "click_event";
export const HOVER_EVENT_TYPE: string = "hover";
export const PAGE_TRANSITION_EVENT_TYPE: string = "page_transition";

export const DROPDOWN: string = "dropdown";

export const SUBMIT_BUTTONS: Record<string, ElementInfo> = {
    ACCOUNT: { id: "submit-button-account" },
    CARD: { id: "submit-button-card" },
    CYCLIC_PAYMENT: { id: "submit-button-cyclic-payment" },
    LOAN: { id: "submit-button-loan" },
    LOGIN: { id: "submit-button-login" },
    TRANSFER: { id: "submit-button-transfer" }
} as const;

export const SUBMIT_BUTTONS_ELEMENTS: ElementInfo[] = Object.values(SUBMIT_BUTTONS);
