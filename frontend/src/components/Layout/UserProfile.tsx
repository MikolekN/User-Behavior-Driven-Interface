import { useContext, useEffect, useState } from "react";
import { Dropdown, Avatar, Checkbox, DarkThemeToggle, useThemeMode, FlowbiteDarkThemeToggleTheme } from "flowbite-react"
import { Link, useNavigate } from "react-router-dom";

import defaultIcon from '../../assets/images/user.png';
import defaultIconDark from '../../assets/images/user-dark.png';
import setingsIcon from '../../assets/images/setting.png';
import setingsIconDark from '../../assets/images/setting-dark.png';
import logoutIcon from '../../assets/images/logout.png';
import logoutIconDark from '../../assets/images/logout-dark.png';
import registerIcon from '../../assets/images/register.png';
import registerIconDark from '../../assets/images/register-dark.png';
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
    const [defaultIconSrc, setDefaultIconSrc] = useState<string>(computedMode == 'dark' ? defaultIconDark : defaultIcon);
    const [settingIconSrc, setSettingIconSrc] = useState<string>(computedMode == 'dark' ? setingsIconDark : setingsIcon);
    const [logoutIconSrc, setLogoutIconSrc] = useState<string>(computedMode == 'dark' ? logoutIconDark : logoutIcon);
    const [registerIconSrc, setRegisterIconSrc] = useState<string>(computedMode == 'dark' ? registerIconDark : registerIcon);

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
        setDefaultIconSrc(computedMode == 'dark' ? defaultIconDark : defaultIcon);
        setSettingIconSrc(computedMode == 'dark' ? setingsIconDark : setingsIcon);
        setLogoutIconSrc(computedMode == 'dark' ? logoutIconDark : logoutIcon);
        setRegisterIconSrc(computedMode == 'dark' ? registerIconDark : registerIcon);
    }, [computedMode]);

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

    const DropdownItem:React.FC<{label: string, path: string, icon: string, onClick?: () => Promise<void>}> = ({label, path, icon, onClick}) => {
        return (
            <Dropdown.Item as={Link} to={path} onClick={onClick} className=' flex bg-transparent text-black font-normal hover:font-semibold hover:text-black'>
                <img src={icon} className="w-5 h-5 mr-1" />
                {label}
            </Dropdown.Item>
        )
    }

    const LanguageDropdownItem:React.FC<{image: string, name: string, code: string, isChosen: boolean}> = ({image, name, code, isChosen}) => {
        return (
            <Dropdown.Item onClick={() => {handleChangeLanguage(code)}} className="space-x-2">
                <img src={image} alt="" className="w-5 h-5" />
                <p>{name}</p>
                <Checkbox defaultChecked disabled className={`w-4 h-4 ${isChosen ? '' : 'hidden'}`}/>
            </Dropdown.Item>
        )
    }

    const NestedDropdownItem: React.FC = () => {
        return (
            <Dropdown arrowIcon={false} inline placement="right" theme={flowbiteDropdown}
                label={
                    <button
                        type="button"
                        className="w-full cursor-pointer items-center justify-start px-3 py-2 text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:bg-gray-600 dark:focus:text-white flex bg-transparent text-black font-normal hover:font-semibold hover:text-black"
                    >
                        <img src={LANGUAGES.find((language) => language.value === i18n.language)?.image} alt="" className="w-5 h-5 mr-1" />
                        <p>{t('menu.languages.title')}</p>
                    </button>
                }
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
                            <img src={defaultIconSrc} className="w-5 h-5" />
                        </Link>

                        <Link to="/register" className="mx-1">
                            <img src={registerIconSrc} className="w-5 h-5" />
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
                        <DropdownItem label={t('menu.profile.login')} path="/login" icon={defaultIconSrc} />
                        <DropdownItem label={t('menu.profile.register')} path="/register" icon={registerIconSrc} />
                    </Dropdown>
                </>
            )}

            {user && (
                <>
                    <div className="flex justify-center items-center">
                        <Link to="/profile" className="mx-1">
                            <img src={defaultIconSrc} className="w-5 h-5" />
                        </Link>

                        <Link to="/settings" className="mx-1">
                            <img src={settingIconSrc} className="w-5 h-5" />
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
                            <img src={logoutIconSrc} className="w-5 h-5" />
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
                        <DropdownItem label={t('menu.profile.profile')} path="/profile" icon={defaultIconSrc}/>
                        <DropdownItem label={t('menu.profile.settings')} path="/settings" icon={settingIconSrc} />
                        <Dropdown.Item onClick={toggleMode} className='bg-transparent text-black font-normal hover:font-semibold hover:text-black px-3'>
                            <DarkThemeToggle theme={darkThemeToggle}/>
                            <p>{t('menu.profile.mode.' + computedMode)}</p>
                        </Dropdown.Item>
                        <NestedDropdownItem />
                        <Dropdown.Divider />
                        <DropdownItem label={t('menu.profile.logout')} path="/" onClick={handleLogout} icon={logoutIconSrc} />
                    </Dropdown>
                </>
            )}

        </div>
    );
}
