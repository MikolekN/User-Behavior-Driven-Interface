import { Navbar } from 'flowbite-react';
import { useCallback, useContext, useEffect, useState } from 'react';
import { UserContext } from '../../../context/UserContext';
import { AccessLevels, MenuOption, menuOptions } from './MainMenuData';
import { Link } from 'react-router-dom';
import { Dropdown } from '../Dropdown';
import { User } from '../../utils/User';
import { blackTextTheme } from '../NavbarLinkBlackText';
import { useTranslation } from 'react-i18next';

export const MainMenu = () => {
    const { t } = useTranslation();
    const { user } = useContext(UserContext);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    const handleDropdownState = useCallback((dropdownName: string | null) => {
        setActiveDropdown((prev) => (prev === dropdownName ? null : dropdownName));
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const menus = document.querySelectorAll('.menu');
            menus.forEach((menu) => {
                if (!menu.contains(event.target as Node)) {
                    setActiveDropdown(null);
                }
            });
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const canAccessOption = (option: MenuOption, user: User | null) => {
        return (
            option.accessLevel === AccessLevels.All ||
            (option.accessLevel === AccessLevels.Unauthorised && !user) ||
            (option.accessLevel === AccessLevels.Authorised && user) ||
            (option.accessLevel === AccessLevels.Admin && user?.role === 'ADMIN')
        );
    };

    const handleLinkClick = () => {
        setActiveDropdown(null);
    };

    const closeDropdown = () => {
        setActiveDropdown(null);
    };

    return (
        <Navbar.Collapse className="menu order-4 md:order-2">
            {menuOptions
                .filter((option) => canAccessOption(option, user))
                .map((option) =>
                    'path' in option ? (
                        <Navbar.Link
                            key={option.key}
                            as={Link}
                            id={option.id}
                            to={option.path}
                            theme={blackTextTheme}
                            className='text-base font-normal hover:text-black hover:font-semibold'
                            onClick={handleLinkClick}
                        >
                            {t('menu.' + option.key)}
                        </Navbar.Link>
                    ) : ( 'submenu' in option && (
                        <Dropdown
                            key={option.key}
                            menu={option}
                            isOpen={activeDropdown === option.key}
                            onClick={() => handleDropdownState(option.key)}
                            closeDropdown={closeDropdown}
                            className="text-base font-normal text-black hover:text-black hover:font-semibold"
                        />
                        )
                    )
                )
            }
        </Navbar.Collapse>
    );
};
