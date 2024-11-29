import { FlowbiteNavbarLinkTheme, Navbar } from 'flowbite-react';
import { useCallback, useContext, useState } from 'react';
import { UserContext } from '../../../context/UserContext';
import { AccessLevels, MenuOption, menuOptions } from './MainMenuData';
import { Link } from 'react-router-dom';
import Dropdown from '../Dropdown';
import { User } from '../../utils/User';

const blackTextTheme: FlowbiteNavbarLinkTheme = {
    base: "block py-2 pl-3 pr-4 md:p-0",
    active: {
        "on": "bg-black text-white dark:text-white md:bg-transparent md:text-black",
        "off": "border-b border-gray-100 text-gray-700 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:border-0 md:hover:bg-transparent md:hover:text-black md:dark:hover:bg-transparent md:dark:hover:text-white"
    },
    disabled: {
        "on": "text-gray-400 hover:cursor-not-allowed dark:text-gray-600",
        "off": ""
    }
};

export const MainMenu = () => {
    const { user } = useContext(UserContext);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [persistentDropdown, setPersistentDropdown] = useState<string | null>(null);

    const handleDropdownState = useCallback((dropdownName: string | null, action: "toggle" | "reset") => {
        setActiveDropdown((prev) => {
            switch (action) {
                case "toggle":
                    return persistentDropdown === dropdownName ? null : dropdownName;
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
                        <Navbar.Link key={option.label} as={Link} to={option.path} theme={blackTextTheme} className='text-base font-normal hover:text-black hover:font-semibold'>
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
