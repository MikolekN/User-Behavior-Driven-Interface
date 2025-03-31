import { useContext, useEffect } from "react";
import { QUICK_ICONS } from "../../../event/utils/constants";
import { Link } from "react-router-dom";
import { DarkThemeToggle, Dropdown } from "flowbite-react";
import { LANGUAGES } from "../../../pages/constants";
import useHandleLogout from "../../../hooks/useHandleLogout";
import LanguageDropdownItem from "../../LanguageDropdownItem/LanguageDropdownItem";
import { t } from "i18next";
import { flowbiteDropdownTheme } from "../../utils/themes/dropdownTheme";
import { darkThemeToggleTheme } from "../../utils/themes/darkThemeToggleTheme";
import i18n from "../../../i18n";
import { PreferencesContext } from "../../../event/context/PreferencesContext";
import { UserContext } from "../../../context/UserContext";
import useApiErrorHandler from "../../../hooks/useApiErrorHandler";


const QuickIcons = () => {
    const { handleLogout } = useHandleLogout();
    const { handleError } = useApiErrorHandler();
    const { user } = useContext(UserContext);
    const { quickIconsPreference, getQuickIconsPreference } = useContext(PreferencesContext);

    useEffect(() => {
        if (!user) return;
        const fetchQuickIconsPreferences = async () => {
            try {
                getQuickIconsPreference();
            } catch (error) {
                handleError(error);
            }
        };

        void fetchQuickIconsPreferences();
    }, [user, getQuickIconsPreference]);

    const quickIconsElements = {
        [QUICK_ICONS.PROFILE.id]: 
            (<Link id={QUICK_ICONS.PROFILE.id} to="/profile" className="mx-1">
                <svg className="w-5 h-5 text-gray-800 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="2 2 20 20">
                    <path fillRule="evenodd" d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4h-4Z" clipRule="evenodd"/>
                </svg>
            </Link>),
        [QUICK_ICONS.SETTINGS.id]: 
            (<Link id={QUICK_ICONS.SETTINGS.id} to="/settings" className="mx-1">
                <svg className="w-5 h-5 text-gray-800 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M9.586 2.586A2 2 0 0 1 11 2h2a2 2 0 0 1 2 2v.089l.473.196.063-.063a2.002 2.002 0 0 1 2.828 0l1.414 1.414a2 2 0 0 1 0 2.827l-.063.064.196.473H20a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-.089l-.196.473.063.063a2.002 2.002 0 0 1 0 2.828l-1.414 1.414a2 2 0 0 1-2.828 0l-.063-.063-.473.196V20a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-.089l-.473-.196-.063.063a2.002 2.002 0 0 1-2.828 0l-1.414-1.414a2 2 0 0 1 0-2.827l.063-.064L4.089 15H4a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h.09l.195-.473-.063-.063a2 2 0 0 1 0-2.828l1.414-1.414a2 2 0 0 1 2.827 0l.064.063L9 4.089V4a2 2 0 0 1 .586-1.414ZM8 12a4 4 0 1 1 8 0 4 4 0 0 1-8 0Z" clipRule="evenodd"/>
                </svg>
            </Link>),
        [QUICK_ICONS.THEME_TOGGLE.id]: 
            (<DarkThemeToggle id={QUICK_ICONS.THEME_TOGGLE.id} theme={darkThemeToggleTheme}/>),
        [QUICK_ICONS.LANGUAGE_SELECTOR.id]: 
            (<Dropdown arrowIcon={false} inline placement="bottom" theme={flowbiteDropdownTheme}
                label={
                    <img id={QUICK_ICONS.LANGUAGE_SELECTOR.id} src={LANGUAGES.find((language) => language.value == i18n.language)?.image} alt="" className="w-5 h-5" />
                }
                >
                {
                    LANGUAGES.map((language) => {
                        return(<LanguageDropdownItem key={language.key} image={language.image} name={t('menu.languages.' + language.key)} code={language.value} isChosen={i18n.language == language.value} />);
                    })
                }
            </Dropdown>),
        [QUICK_ICONS.LOGOUT.id]: 
            (<Link id={QUICK_ICONS.LOGOUT.id} to="/" onClick={handleLogout} className="mx-1">
                <svg className="w-5 h-5 text-gray-800 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm5.757-1a1 1 0 1 0 0 2h8.486a1 1 0 1 0 0-2H7.757Z" clipRule="evenodd"/>
                </svg>
            </Link>)
    };

    return (
        <div className="flex justify-center items-center">
            {quickIconsPreference && quickIconsElements[quickIconsPreference.elementId]}
        </div>
    );
};

export default QuickIcons;
