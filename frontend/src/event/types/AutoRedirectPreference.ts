import { Preferences } from "./Preferences";

export interface AutoRedirectPreference {
    accountForm: string;
    accountFormEdit: string;
    cardForm: string;
    cardFormEdit: string;
    cyclicPaymentForm: string;
    cyclicPaymentFormEdit: string;
    loanForm: string;
    transferForm: string;
}

export const getAutoRedirectPreferencesFromUserPreferences= (userPreferences: Preferences): AutoRedirectPreference => {
    return {
        accountForm: userPreferences.autoRedirectPreference.accountForm,
        accountFormEdit: userPreferences.autoRedirectPreference.accountFormEdit,
        cardForm: userPreferences.autoRedirectPreference.cardForm,
        cardFormEdit: userPreferences.autoRedirectPreference.cardFormEdit,
        cyclicPaymentForm: userPreferences.autoRedirectPreference.cyclicPaymentForm,
        cyclicPaymentFormEdit: userPreferences.autoRedirectPreference.cyclicPaymentFormEdit,
        loanForm: userPreferences.autoRedirectPreference.loanForm,
        transferForm: userPreferences.autoRedirectPreference.transferForm
    }
}
