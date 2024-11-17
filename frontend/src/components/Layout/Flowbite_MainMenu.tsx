import { Navbar } from 'flowbite-react';
import { useCallback, useContext, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import { AccessLevels, menuOptions } from './MainMenu/MainMenuData';
import { Link } from 'react-router-dom';
import Dropdown from './Dropdown';

export const MainMenu = () => {
    const { user } = useContext(UserContext);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [persistentDropdown, setPersistentDropdown] = useState<string | null>(null);

    const handleDropdownToggle = useCallback((dropdownName: string) => {
        if (persistentDropdown === dropdownName) {
            setPersistentDropdown(null);
            setActiveDropdown(null);
        } else {
            setPersistentDropdown(dropdownName);
            setActiveDropdown(dropdownName);
        }
    }, [persistentDropdown]);

    const handleDropdownHover = (dropdownName: string) => {
        setActiveDropdown(dropdownName);
        if (persistentDropdown !== dropdownName) {
            setPersistentDropdown(null);
        }
    };

    const handleMouseLeave = (dropdownName: string) => {
        if (persistentDropdown !== dropdownName) {
            setActiveDropdown(null);
        }
    };

    const handleOtherOptionHover = () => {
        setPersistentDropdown(null);
        setActiveDropdown(null);
    };

    const handleOptionClick = () => {
        setPersistentDropdown(null);
        setActiveDropdown(null);
    };

    return (
        <Navbar.Collapse>
            { menuOptions.map((option) => {
                if (
                    option.accessLevel == AccessLevels.All ||
                    option.accessLevel == AccessLevels.Unauthorised && !user ||
                    option.accessLevel == AccessLevels.Authorised && user ||
                    option.accessLevel == AccessLevels.Admin && user && user.role === 'ADMIN'
                ) {
                    if ('path' in option) {
                        return (
                            <Navbar.Link onMouseEnter={handleOtherOptionHover}>
                                <Link to={option.path} className='block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500 dark:bg-blue-600 md:dark:bg-transparent' aria-current="page">
                                    {option.label}
                                </Link>
                            </Navbar.Link>
                        );
                    }

                    if ('submenu' in option) {
                        return (
                            <Dropdown
                                title={option.label}
                                options={option.submenu}
                                isOpen={activeDropdown === option.label}
                                isPersistent={persistentDropdown === option.label}
                                onToggle={() => handleDropdownToggle(option.label)}
                                onHover={() => handleDropdownHover(option.label)}
                                onMouseLeave={() => handleMouseLeave(option.label)}
                                onOptionClick={() => handleOptionClick()}
                                id='navigation-option-transfer'
                                className='block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500 dark:bg-blue-600 md:dark:bg-transparent' aria-current="page"
                            />
                        )
                    }
                }
            })}
        </Navbar.Collapse>
    );
};
