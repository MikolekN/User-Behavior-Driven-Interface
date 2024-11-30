import { Navbar } from 'flowbite-react';
import { useCallback, useContext, useEffect, useState } from 'react';
import { UserContext } from '../../../context/UserContext';
import { AccessLevels, MenuOption, menuOptions } from './MainMenuData';
import { Link } from 'react-router-dom';
import { Dropdown } from '../Dropdown';
import { User } from '../../utils/User';
import { blackTextTheme } from '../NavbarLinkBlackText';

export const MainMenu = () => {
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
                            key={option.label}
                            as={Link}
                            to={option.path}
                            theme={blackTextTheme}
                            className='text-base font-normal hover:text-black hover:font-semibold'
                            onClick={handleLinkClick}
                        >
                            {option.label}
                        </Navbar.Link>
                    ) : ( 'submenu' in option && (
                        <Dropdown
                            key={option.label}
                            title={option.label}
                            options={option.submenu}
                            isOpen={activeDropdown === option.label}
                            onClick={() => handleDropdownState(option.label)}
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
