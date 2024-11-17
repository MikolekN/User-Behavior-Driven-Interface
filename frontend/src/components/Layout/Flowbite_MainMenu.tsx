import { Navbar } from 'flowbite-react';
import { useCallback, useContext, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import { AccessLevels, MenuOption, menuOptions } from './MainMenu/MainMenuData';
import { Link } from 'react-router-dom';
import Dropdown from './Dropdown';
import { User } from '../utils/User';

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
                        <Navbar.Link onMouseEnter={() => handleDropdownState(null, "reset")}>
                            <Link to={option.path} className='block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500 dark:bg-blue-600 md:dark:bg-transparent' aria-current="page">
                                {option.label}
                            </Link>
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
                                id={option.label}
                                className='block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500 dark:bg-blue-600 md:dark:bg-transparent' aria-current="page"
                            />
                        )
                    )
                )
            }
        </Navbar.Collapse>
    );
};
