import { useState, useContext, useCallback } from 'react';
import './MainMenu.css';
import { Link } from 'react-router-dom';
import Dropdown from '../Dropdown/Dropdown';
import { UserContext } from '../../../context/UserContext';
import { customerServiceSubmenuOptions, financesSubmenuOptions, settingsSubmenuOptions, transferSubmenuOptions } from './MainMenuData';

const MainMenu = () => {
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
        <div className="main-menu-container">
            <nav className="nav">
                <ul className="nav-list">
                    <li className='nav-list-option'>
                        <Link to="/" onMouseEnter={handleOtherOptionHover}>Start</Link>
                    </li>
                    
                    {!user && (
                        <>
                            <li className='nav-list-option'>
                                <Link to="/login">Login</Link>
                            </li>
                            <li className='nav-list-option'>
                                <Link to="/register">Register</Link>
                            </li>
                        </>
                    )}

                    {user && (
                        <>
                            <Dropdown
                                title="Przelewy"
                                options={transferSubmenuOptions}
                                isOpen={activeDropdown === 'przelewy'}
                                isPersistent={persistentDropdown === 'przelewy'}
                                onToggle={() => handleDropdownToggle('przelewy')}
                                onHover={() => handleDropdownHover('przelewy')}
                                onMouseLeave={() => handleMouseLeave('przelewy')}
                                onOptionClick={() => handleOptionClick()}
                            />

                            <Dropdown
                                title="Ustawienia"
                                options={settingsSubmenuOptions}
                                isOpen={activeDropdown === 'ustawienia'}
                                isPersistent={persistentDropdown === 'ustawienia'}
                                onToggle={() => handleDropdownToggle('ustawienia')}
                                onHover={() => handleDropdownHover('ustawienia')}
                                onMouseLeave={() => handleMouseLeave('ustawienia')}
                                onOptionClick={() => handleOptionClick()}
                            />

                            <Dropdown
                                title="Finanse"
                                options={financesSubmenuOptions}
                                isOpen={activeDropdown === 'finanse'}
                                isPersistent={persistentDropdown === 'finanse'}
                                onToggle={() => handleDropdownToggle('finanse')}
                                onHover={() => handleDropdownHover('finanse')}
                                onMouseLeave={() => handleMouseLeave('finanse')}
                                onOptionClick={() => handleOptionClick()}
                            />
                        
                            <Dropdown
                                title="Obsługa klienta"
                                options={customerServiceSubmenuOptions}
                                isOpen={activeDropdown === 'obsługa_klienta'}
                                isPersistent={persistentDropdown === 'obsługa_klienta'}
                                onToggle={() => handleDropdownToggle('obsługa_klienta')}
                                onHover={() => handleDropdownHover('obsługa_klienta')}
                                onMouseLeave={() => handleMouseLeave('obsługa_klienta')}
                                onOptionClick={() => handleOptionClick()}
                            />

                            {user.role === 'ADMIN' && (
                                <li className='nav-list-option'>
                                    <Link to="\login" onMouseEnter={handleOtherOptionHover}>Panel administratora</Link>
                                </li>
                            )}
                        </>
                    )}
                </ul>
            </nav>
        </div>
    );
};

export default MainMenu;
