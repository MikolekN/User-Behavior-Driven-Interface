import { useContext, useEffect, useState } from "react";
import { Dropdown, Avatar, Checkbox, DarkThemeToggle, useThemeMode, FlowbiteDarkThemeToggleTheme } from "flowbite-react"
import { Link, useNavigate } from "react-router-dom";

import defaultIcon from '../../assets/images/user.png';
import defaultIconDark from '../../assets/images/user-dark.png';
import { UserContext } from '../../context/UserContext';
import { UserIconContext } from '../../context/UserIconContext';
import { AuthContext } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import { LANGUAGES } from "../../pages/constants";

export const UserProfile = () => {
    const navigate = useNavigate();
    const { i18n, t } = useTranslation();
    const { user } = useContext(UserContext);
    const { logout } = useContext(AuthContext);
    const { getIcon } = useContext(UserIconContext);
    const { computedMode, toggleMode } = useThemeMode();

    const [iconSrc, setIconSrc] = useState<string>(computedMode == 'dark' ? defaultIconDark : defaultIcon);

    const handleChangeLanguage = (lang_code: string) => {
        i18n.changeLanguage(lang_code);
        localStorage.setItem('language', lang_code);
    }

    const handleLogout = async () => {
        try {
            await logout();
        } catch { /* If error occurs it is displayed in console */ } finally {
            navigate('/');
        }
    };

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
                setIconSrc(computedMode == 'dark' ? defaultIconDark : defaultIcon);
            }
        };

        void fetchIcon();
    }, [user, getIcon, user?.icon, computedMode]);

    const DropdownItem:React.FC<{label: string, path: string, icon: string | React.ReactNode, className?: string, onClick?: () => Promise<void>}> = ({label, path, icon, className, onClick}) => {
        return (
            <Dropdown.Item as={Link} to={path} onClick={onClick} className="flex bg-transparent text-black font-normal hover:font-semibold hover:text-black">
                {typeof icon === 'string' ? (
                    <img src={icon} className={` ${className} w-5 h-5 mr-1`} />
                ) : (
                    <span className={` ${className} w-5 h-5 mr-1 flex items-center justify-center`}>{icon}</span>
                )}
                {label}
            </Dropdown.Item>
        )
    }

    const LanguageDropdownItem:React.FC<{image: string, name: string, code: string, isChosen: boolean}> = ({image, name, code, isChosen}) => {
        return (
            <Dropdown.Item onClick={() => {handleChangeLanguage(code)}} className="space-x-2 w-full">
                <img src={image} alt="" className="w-5 h-5" />
                <p>{name}</p>
                <Checkbox defaultChecked disabled className={`w-4 h-4 ${isChosen ? '' : 'hidden'}`}/>
            </Dropdown.Item>
        )
    }

    const NestedDropdownItem: React.FC = () => {
        return (
            <Dropdown arrowIcon={false} inline placement="right"
                renderTrigger={() => (
                    <button
                        type="button"
                        className="w-full cursor-pointer items-center justify-start px-4 py-2 text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:bg-gray-600 dark:focus:text-white flex bg-transparent text-black font-normal hover:font-semibold hover:text-black"
                    >
                        <img
                            src={LANGUAGES.find((language) => language.value === i18n.language)?.image}
                            alt=""
                            className="w-5 h-5 mr-1"
                        />
                        <p>{t('menu.language')}</p>
                    </button>
                )}
            >
                {
                    LANGUAGES.map((language) => (
                        <LanguageDropdownItem
                            key={language.value}
                            image={language.image}
                            name={t('menu.languages.' + language.key)}
                            code={language.value}
                            isChosen={i18n.language === language.value}
                        />
                    ))
                }
            </Dropdown>
        );
    };

    const darkThemeToggle: FlowbiteDarkThemeToggleTheme = {
        root: {
            base: "block mx-1",
            icon: "w-5 h-5"
        }
    };

    const flowbiteDropdown = {
        inlineWrapper: "mx-1"
      };

    return (
        <div className="flex order-3 md:order-3 space-x-2">


            {!user && (
                <>
                    <div className="flex justify-center items-center">
                        <DarkThemeToggle theme={darkThemeToggle}/>

                        <Dropdown arrowIcon={false} inline placement="bottom" theme={flowbiteDropdown}
                            label={
                                <img src={LANGUAGES.find((language) => language.value == i18n.language)?.image} alt="" className="w-5 h-5" />
                            }
                        >
                            {
                                LANGUAGES.map((language) => {
                                    return(<LanguageDropdownItem image={language.image} name={t('menu.languages.' + language.key)} code={language.value} isChosen={i18n.language == language.value} />);
                                })
                            }
                        </Dropdown>

                        <Link to="/login" className="mx-1">
                            <svg className="w-5 h-5 text-gray-800 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="2 2 20 20">
                                <path fillRule="evenodd" d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4h-4Z" clipRule="evenodd"/>
                            </svg>
                        </Link>

                        <Link to="/register" className="mx-1">
                            <svg className="w-5 h-5 text-gray-800 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="2 2 20 20">
                                <path fillRule="evenodd" d="M9 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4H7Zm8-1a1 1 0 0 1 1-1h1v-1a1 1 0 1 1 2 0v1h1a1 1 0 1 1 0 2h-1v1a1 1 0 1 1-2 0v-1h-1a1 1 0 0 1-1-1Z" clipRule="evenodd"/>
                            </svg>
                        </Link>
                    </div>
                    <Dropdown arrowIcon={false} inline placement="bottom"
                        label={
                            <Avatar alt="User profile icon" img={iconSrc} rounded className='rounded-full hover:bg-gray-200 hover:dark:bg-gray-700 transition ease-in-out duration-300'/>
                        }
                    >
                        <Dropdown.Item onClick={toggleMode} className='bg-transparent text-black font-normal hover:font-semibold hover:text-black px-3'>
                            <DarkThemeToggle theme={darkThemeToggle}/>
                            <p>{t('menu.profile.mode.' + computedMode)}</p>
                        </Dropdown.Item>
                        <NestedDropdownItem />
                        <DropdownItem label={t('menu.profile.login')} path="/login"
                            icon={
                                <svg className="w-5 h-5 text-gray-800 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="2 2 20 20">
                                    <path fillRule="evenodd" d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4h-4Z" clipRule="evenodd"/>
                                </svg>
                            }
                        />
                        <DropdownItem label={t('menu.profile.register')} path="/register" className="ml-1"
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
                    <div className="flex justify-center items-center">
                        <Link to="/profile" className="mx-1">
                            <svg className="w-5 h-5 text-gray-800 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="2 2 20 20">
                                <path fillRule="evenodd" d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4h-4Z" clipRule="evenodd"/>
                            </svg>
                        </Link>

                        <Link to="/settings" className="mx-1">
                            <svg className="w-5 h-5 text-gray-800 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                <path fill-rule="evenodd" d="M9.586 2.586A2 2 0 0 1 11 2h2a2 2 0 0 1 2 2v.089l.473.196.063-.063a2.002 2.002 0 0 1 2.828 0l1.414 1.414a2 2 0 0 1 0 2.827l-.063.064.196.473H20a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-.089l-.196.473.063.063a2.002 2.002 0 0 1 0 2.828l-1.414 1.414a2 2 0 0 1-2.828 0l-.063-.063-.473.196V20a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-.089l-.473-.196-.063.063a2.002 2.002 0 0 1-2.828 0l-1.414-1.414a2 2 0 0 1 0-2.827l.063-.064L4.089 15H4a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h.09l.195-.473-.063-.063a2 2 0 0 1 0-2.828l1.414-1.414a2 2 0 0 1 2.827 0l.064.063L9 4.089V4a2 2 0 0 1 .586-1.414ZM8 12a4 4 0 1 1 8 0 4 4 0 0 1-8 0Z" clip-rule="evenodd"/>
                            </svg>
                        </Link>

                        <DarkThemeToggle theme={darkThemeToggle}/>

                        <Dropdown arrowIcon={false} inline placement="bottom" theme={flowbiteDropdown}
                            label={
                                <img src={LANGUAGES.find((language) => language.value == i18n.language)?.image} alt="" className="w-5 h-5" />
                            }
                        >
                            {
                                LANGUAGES.map((language) => {
                                    return(<LanguageDropdownItem image={language.image} name={t('menu.languages.' + language.key)} code={language.value} isChosen={i18n.language == language.value} />);
                                })
                            }
                        </Dropdown>

                        <Link to="/" onClick={handleLogout} className="mx-1">
                            <svg className="w-5 h-5 text-gray-800 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                <path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm5.757-1a1 1 0 1 0 0 2h8.486a1 1 0 1 0 0-2H7.757Z" clip-rule="evenodd"/>
                            </svg>
                        </Link>
                    </div>

                    <Dropdown arrowIcon={false} inline placement="bottom"
                        label={
                            <Avatar alt="User profile icon" img={iconSrc} rounded className='rounded-full hover:bg-gray-200 hover:dark:bg-gray-700 transition ease-in-out duration-300'/>
                        }
                    >
                        <Dropdown.Header className="flex flex-col justify-center items-center">
                            <span className="block text-sm">{user?.login}</span>
                            <span className="block truncate text-sm font-medium">{user?.email}</span>
                        </Dropdown.Header>
                        <DropdownItem label={t('menu.profile.profile')} path="/profile"
                            icon={
                                <svg className="w-5 h-5 text-gray-800 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="2 2 20 20">
                                    <path fillRule="evenodd" d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4h-4Z" clipRule="evenodd"/>
                                </svg>
                            }
                        />
                        <DropdownItem label={t('menu.profile.settings')} path="/settings"
                            icon={
                                <svg className="w-5 h-5 text-gray-800 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                    <path fill-rule="evenodd" d="M9.586 2.586A2 2 0 0 1 11 2h2a2 2 0 0 1 2 2v.089l.473.196.063-.063a2.002 2.002 0 0 1 2.828 0l1.414 1.414a2 2 0 0 1 0 2.827l-.063.064.196.473H20a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-.089l-.196.473.063.063a2.002 2.002 0 0 1 0 2.828l-1.414 1.414a2 2 0 0 1-2.828 0l-.063-.063-.473.196V20a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-.089l-.473-.196-.063.063a2.002 2.002 0 0 1-2.828 0l-1.414-1.414a2 2 0 0 1 0-2.827l.063-.064L4.089 15H4a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h.09l.195-.473-.063-.063a2 2 0 0 1 0-2.828l1.414-1.414a2 2 0 0 1 2.827 0l.064.063L9 4.089V4a2 2 0 0 1 .586-1.414ZM8 12a4 4 0 1 1 8 0 4 4 0 0 1-8 0Z" clip-rule="evenodd"/>
                                </svg>
                            }
                        />
                        <Dropdown.Item onClick={toggleMode} className='bg-transparent text-black font-normal hover:font-semibold hover:text-black px-3'>
                            <DarkThemeToggle theme={darkThemeToggle}/>
                            <p>{t('menu.profile.mode.' + computedMode)}</p>
                        </Dropdown.Item>
                        <NestedDropdownItem />
                        <Dropdown.Divider />
                        <DropdownItem label={t('menu.profile.logout')} path="/" onClick={handleLogout}
                            icon={
                                <svg className="w-5 h-5 text-gray-800 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                    <path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm5.757-1a1 1 0 1 0 0 2h8.486a1 1 0 1 0 0-2H7.757Z" clip-rule="evenodd"/>
                                </svg>
                            }
                        />
                    </Dropdown>
                </>
            )}

        </div>
    );
}
