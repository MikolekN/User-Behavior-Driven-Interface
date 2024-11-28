import { Navbar } from 'flowbite-react';
import { useCallback, useContext, useState } from 'react';
import { UserContext } from '../../../context/UserContext';
import { AccessLevels, MenuOption, menuOptions } from './MainMenuData';
import { Link } from 'react-router-dom';
import Dropdown from '../Dropdown';
import { User } from '../../utils/User';

export const MainMenu = () => {
    const { user } = useContext(UserContext);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [persistentDropdown, setPersistentDropdown] = useState<string | null>(null);

    const handleDropdownState = useCallback((dropdownName: string | null, action: "toggle" | "hover" | "leave" | "reset") => {
        setActiveDropdown((prev) => {
            switch (action) {
                case "toggle":
                    return persistentDropdown === dropdownName ? null : dropdownName;
                case "hover":
                    return dropdownName;
                case "leave":
                    return persistentDropdown === dropdownName ? prev : null;
                case "reset":
                    return null;
                default:
                    return prev;
            }
        });

        if (action === "toggle" || action === "reset") {
            setPersistentDropdown((_) => (persistentDropdown === dropdownName ? null : dropdownName));
        }
    },[persistentDropdown]);

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
                        <Navbar.Link onMouseEnter={() => handleDropdownState(null, "reset")} as={Link} to={option.path} className='text-base font-normal text-black hover:text-black hover:font-semibold'>
                            {option.label}
                        </Navbar.Link>
                    ) : ( 'submenu' in option && (
                            <Dropdown
                                key={option.label}
                                title={option.label}
                                options={option.submenu}
                                isOpen={activeDropdown === option.label}
                                isPersistent={persistentDropdown === option.label}
                                onToggle={() => handleDropdownState(option.label, "toggle")}
                                onHover={() => handleDropdownState(option.label, "hover")}
                                onMouseLeave={() => handleDropdownState(option.label, "leave")}
                                onOptionClick={() => handleDropdownState(null, "reset")}
                                className='text-base font-normal text-black hover:text-black hover:font-semibold'
                            />
                        )
                    )
                )
            }
        </Navbar.Collapse>
    );
};
