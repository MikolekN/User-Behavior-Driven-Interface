import { MegaMenu, Navbar } from 'flowbite-react';
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import { AccessLevels, menuOptions } from './MainMenu/MainMenuData';

export const MainMenu = () => {
    const { user } = useContext(UserContext);

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
                        return (<Navbar.Link href={option.path}>{option.label}</Navbar.Link>);
                    }

                    if ('submenu' in option) {
                        return (
                            <Navbar.Link>
                                <MegaMenu.Dropdown toggle={<>{option.label}</>}>
                                    <ul className="space-y-4 p-4 ">
                                    {option.submenu.map((submenu_option) => (
                                        <li>
                                        <a href={submenu_option.path} className="hover:text-primary-600 dark:hover:text-primary-500">
                                        {submenu_option.label}
                                        </a>
                                        </li>
                                    ))}  
                                    </ul>
                                </MegaMenu.Dropdown>
                            </Navbar.Link>
                        )
                    }
                }
            })}
        </Navbar.Collapse>
    );
};
