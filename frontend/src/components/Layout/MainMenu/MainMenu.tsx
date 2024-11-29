import { Navbar } from 'flowbite-react';
import { useCallback, useContext, useState } from 'react';
import { UserContext } from '../../../context/UserContext';
import { AccessLevels, MenuOption, menuOptions } from './MainMenuData';
import { Link } from 'react-router-dom';
import Dropdown from '../Dropdown';
import { User } from '../../utils/User';
import { blackTextTheme } from '../NavbarLinkBlackText';

export const MainMenu = () => {
    const { user } = useContext(UserContext);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    const handleDropdownState = useCallback((dropdownName: string | null) => {
        setActiveDropdown((prev) => (prev === dropdownName ? null : dropdownName));
    }, []);

    const canAccessOption = (option: MenuOption, user: User | null) => {
        return (
            option.accessLevel === AccessLevels.All ||
            (option.accessLevel === AccessLevels.Unauthorised && !user) ||
            (option.accessLevel === AccessLevels.Authorised && user) ||
            (option.accessLevel === AccessLevels.Admin && user?.role === 'ADMIN')
        );
    };

    return (
        <Navbar.Collapse>
            { menuOptions
                .filter((option) => canAccessOption(option, user))
                .map((option) =>
                    'path' in option ? (
                        <Navbar.Link key={option.label} as={Link} to={option.path} theme={blackTextTheme} className='text-base font-normal hover:text-black hover:font-semibold'>
                            {option.label}
                        </Navbar.Link>
                    ) : ( 'submenu' in option && (
                        <Dropdown
                            key={option.label}
                            title={option.label}
                            options={option.submenu}
                            isOpen={activeDropdown === option.label}
                            onClick={() => handleDropdownState(option.label)}
                            className="text-base font-normal text-black hover:text-black hover:font-semibold"
                        />
                        )
                    )
                )
            }
        </Navbar.Collapse>
    );
};
