import { useContext, useEffect, useState } from "react";
import { Dropdown, Avatar, DarkThemeToggle, useThemeMode } from "flowbite-react"
import { Link } from "react-router-dom";
import { UserContext } from '../../context/UserContext';
import { UserIconContext } from '../../context/UserIconContext';
import { useTranslation } from "react-i18next";
import { LANGUAGES } from "../../pages/constants";
import { QUICK_ICONS, USER_DROPDOWN } from "../../event/utils/constants";
import { flowbiteDropdownTheme } from "../utils/themes/dropdownTheme";
import { darkThemeToggleTheme } from "../utils/themes/darkThemeToggleTheme";
import DropdownItem from "../DropdownItem/DropdownItem";
import LanguageDropdownItem from "../LanguageDropdownItem/LanguageDropdownItem";
import NestedDropdownItem from "../NestedDropdownItem/NestedDropdownItem";
import useHandleLogout from "../../hooks/useHandleLogout";
import QuickIcons from "../Event/QuickIcons/QuickIcons";


export const UserProfile = () => {
    const { i18n, t } = useTranslation();
    const { user } = useContext(UserContext);
    const { getIcon } = useContext(UserIconContext);
    const { computedMode, toggleMode } = useThemeMode();
    const { handleLogout } = useHandleLogout();

    const [iconSrc, setIconSrc] = useState<string | null>(null);

    useEffect(() => {
        const fetchIcon = async () => {
            if (user && !user.icon) {
                try {
                    await getIcon();
                } catch { /* If error occurs it is displayed in console */ }
            }

            if (user && user.icon) {
                const iconURL = URL.createObjectURL(user.icon);
                setIconSrc(iconURL);
                return () => {
                    URL.revokeObjectURL(iconURL);
                };
            } else {
                setIconSrc(null);
            }
        };

        void fetchIcon();
    }, [user, getIcon, user?.icon, computedMode]);

    return (
        <div className="flex order-3 md:order-3 space-x-2">
            {!user && (
                <>
                    <div className="flex justify-center items-center">
                        <DarkThemeToggle id={QUICK_ICONS.THEME_TOGGLE.id} theme={darkThemeToggleTheme}/>
                        <Dropdown arrowIcon={false} inline placement="bottom" theme={flowbiteDropdownTheme}
                            label={
                                <img id={QUICK_ICONS.LANGUAGE_SELECTOR.id} src={LANGUAGES.find((language) => language.value == i18n.language)?.image} alt="" className="w-5 h-5" />
                            }
                        >
                            {
                                LANGUAGES.map((language) => {
                                    return(<LanguageDropdownItem key={language.key} image={language.image} name={t('menu.languages.' + language.key)} code={language.value} isChosen={i18n.language == language.value} />);
                                })
                            }
                        </Dropdown>
                        <Link id={QUICK_ICONS.LOGIN.id} to="/login" className="mx-1">
                            <svg className="w-5 h-5 text-gray-800 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="2 2 20 20">
                                <path fillRule="evenodd" d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4h-4Z" clipRule="evenodd"/>
                            </svg>
                        </Link>

                        <Link id={QUICK_ICONS.REGISTER.id} to="/register" className="mx-1">
                            <svg className="w-5 h-5 text-gray-800 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="2 2 20 20">
                                <path fillRule="evenodd" d="M9 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4H7Zm8-1a1 1 0 0 1 1-1h1v-1a1 1 0 1 1 2 0v1h1a1 1 0 1 1 0 2h-1v1a1 1 0 1 1-2 0v-1h-1a1 1 0 0 1-1-1Z" clipRule="evenodd"/>
                            </svg>
                        </Link>
                    </div>
                    <Dropdown arrowIcon={false} inline placement="bottom"
                        label={
                            <svg  className="w-10 h-10 text-gray-800 dark:text-gray-400 rounded-full hover:bg-gray-200 hover:dark:bg-gray-700 transition ease-in-out duration-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="2 2 20 20">
                                <path fillRule="evenodd" d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4h-4Z" clipRule="evenodd"/>
                            </svg>
                        }
                    >
                        <Dropdown.Item id={USER_DROPDOWN.THEME_TOGGLE.id} onClick={toggleMode} className='bg-transparent text-black font-normal hover:font-semibold hover:text-black px-3'>
                            <DarkThemeToggle theme={darkThemeToggleTheme}/>
                            <p>{t('menu.profile.mode.' + computedMode)}</p>
                        </Dropdown.Item>
                        <NestedDropdownItem id={USER_DROPDOWN.LANGUAGE_SELECTOR.id} />
                        <DropdownItem id={USER_DROPDOWN.LOGIN.id} label={t('menu.profile.login')} path="/login"
                            icon={
                                <svg className="w-5 h-5 text-gray-800 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="2 2 20 20">
                                    <path fillRule="evenodd" d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4h-4Z" clipRule="evenodd"/>
                                </svg>
                            }
                        />
                        <DropdownItem id={USER_DROPDOWN.REGISTER.id} label={t('menu.profile.register')} path="/register" className="ml-1"
                            icon={
                                <svg className="w-5 h-5 text-gray-800 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="2 2 20 20">
                                    <path fillRule="evenodd" d="M9 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4H7Zm8-1a1 1 0 0 1 1-1h1v-1a1 1 0 1 1 2 0v1h1a1 1 0 1 1 0 2h-1v1a1 1 0 1 1-2 0v-1h-1a1 1 0 0 1-1-1Z" clipRule="evenodd"/>
                                </svg>
                            }
                        />
                    </Dropdown>
                </>
            )}

            {user && (
                <>
                    <QuickIcons />
                    <Dropdown arrowIcon={false} inline placement="bottom"
                        label={
                            <>
                                {!iconSrc ? (
                                    <svg className="w-10 h-10 text-gray-800 dark:text-gray-400 rounded-full hover:bg-gray-200 hover:dark:bg-gray-700 transition ease-in-out duration-300"
                                        aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="2 2 20 20">
                                        <path fillRule="evenodd" d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4h-4Z" clipRule="evenodd"/>
                                    </svg>
                                ) : (
                                    <Avatar alt="User profile icon" img={iconSrc || undefined} rounded className="rounded-full hover:bg-gray-200 hover:dark:bg-gray-700 transition ease-in-out duration-300"/>
                                )}
                            </>
                        }
                    >
                        <Dropdown.Header className="flex flex-col justify-center items-center">
                            <span className="block text-sm">{user?.login}</span>
                            <span className="block truncate text-sm font-medium">{user?.email}</span>
                        </Dropdown.Header>
                        <DropdownItem id={USER_DROPDOWN.PROFILE.id} label={t('menu.profile.profile')} path="/profile"
                            icon={
                                <svg className="w-5 h-5 text-gray-800 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="2 2 20 20">
                                    <path fillRule="evenodd" d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4h-4Z" clipRule="evenodd"/>
                                </svg>
                            }
                        />
                        <DropdownItem id={USER_DROPDOWN.SETTINGS.id} label={t('menu.profile.settings')} path="/settings"
                            icon={
                                <svg className="w-5 h-5 text-gray-800 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M9.586 2.586A2 2 0 0 1 11 2h2a2 2 0 0 1 2 2v.089l.473.196.063-.063a2.002 2.002 0 0 1 2.828 0l1.414 1.414a2 2 0 0 1 0 2.827l-.063.064.196.473H20a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-.089l-.196.473.063.063a2.002 2.002 0 0 1 0 2.828l-1.414 1.414a2 2 0 0 1-2.828 0l-.063-.063-.473.196V20a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-.089l-.473-.196-.063.063a2.002 2.002 0 0 1-2.828 0l-1.414-1.414a2 2 0 0 1 0-2.827l.063-.064L4.089 15H4a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h.09l.195-.473-.063-.063a2 2 0 0 1 0-2.828l1.414-1.414a2 2 0 0 1 2.827 0l.064.063L9 4.089V4a2 2 0 0 1 .586-1.414ZM8 12a4 4 0 1 1 8 0 4 4 0 0 1-8 0Z" clipRule="evenodd"/>
                                </svg>
                            }
                        />
                        <Dropdown.Item id={USER_DROPDOWN.THEME_TOGGLE.id} onClick={toggleMode} className='bg-transparent text-black font-normal hover:font-semibold hover:text-black px-3'>
                            <DarkThemeToggle theme={darkThemeToggleTheme}/>
                            <p>{t('menu.profile.mode.' + computedMode)}</p>
                        </Dropdown.Item>
                        <NestedDropdownItem id={USER_DROPDOWN.LANGUAGE_SELECTOR.id} />
                        <Dropdown.Divider />
                        <DropdownItem id={USER_DROPDOWN.LOGOUT.id} label={t('menu.profile.logout')} path="/" onClick={handleLogout}
                            icon={
                                <svg className="w-5 h-5 text-gray-800 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm5.757-1a1 1 0 1 0 0 2h8.486a1 1 0 1 0 0-2H7.757Z" clipRule="evenodd"/>
                                </svg>
                            }
                        />
                    </Dropdown>
                </>
            )}
        </div>
    );
};
