import { useContext, useEffect, useState } from "react";
import { Dropdown, Avatar, Checkbox } from "flowbite-react"
import { Link, useNavigate } from "react-router-dom";

import defaultIcon from '../../assets/images/user.png';
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

    const [iconSrc, setIconSrc] = useState<string>(defaultIcon);

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
                setIconSrc(defaultIcon);
            }
        };

        void fetchIcon();
    }, [user, getIcon, user?.icon]);

    const DropdownItem:React.FC<{label: string, path: string, onClick?: () => Promise<void>}> = ({label, path, onClick}) => {
        return (
            <Dropdown.Item as={Link} to={path} onClick={onClick} className='block bg-transparent text-black font-normal hover:font-semibold hover:text-black'>
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

    return (<div className="flex order-3 md:order-3 space-x-2">
        <div className="flex justify-center items-center">
            <Dropdown arrowIcon={false} inline placement="bottom"
                label={
                    <img src={LANGUAGES.find((language) => language.value == i18n.language)?.image} alt="" className="w-5 h-5" />
                }
            >
                {
                    LANGUAGES.map((language) => {
                        return(<LanguageDropdownItem image={language.image} name={language.name} code={language.value} isChosen={i18n.language == language.value} />);
                    })
                }
            </Dropdown>
        </div>
        
        <Dropdown arrowIcon={false} inline placement="bottom"
            label={
                <Avatar alt="User profile icon" img={iconSrc} rounded className='rounded-full hover:bg-gray-200 hover:dark:bg-gray-700 transition ease-in-out duration-300'/>
            }
        >

        {!user && (
            <>
                <DropdownItem label={t('menu.profile.login')} path="/login" />
                <DropdownItem label={t('menu.profile.register')} path="/register" />
            </>
        )}

        {user && (
            <>
                <Dropdown.Header className="flex flex-col justify-center items-center">
                    <span className="block text-sm">{user?.login}</span>
                    <span className="block truncate text-sm font-medium">{user?.email}</span>
                </Dropdown.Header>
                <DropdownItem label={t('menu.profile.profile')} path="/profile" />
                <DropdownItem label={t('menu.profile.settings')} path="/settings" />
                <Dropdown.Divider />
                <DropdownItem label={t('menu.profile.logout')} path="/" onClick={handleLogout}/>
            </>
        )}
        </Dropdown>
    </div>);
}
