import React, { useState, useContext, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Dropdown from '../Dropdown';
import { UserContext } from '../../../context/UserContext';
import { customerServiceSubmenuOptions, financesSubmenuOptions, settingsSubmenuOptions, transferSubmenuOptions } from './MainMenuData';

const MainMenu: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
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
        <div id='main-menu-container' className={`${isOpen ? 'block' : 'hidden'} md:block`}>
            <nav id='navigation' className='flex items-center absolute left-1/2 -translate-x-1/2 top-0 h-full'>
                <ul id='navigation-list' className='flex items-center list-none'>
                    <li id='navigation-option-start' className='mr-5 flex items-center'>
                        <Link to="/" onMouseEnter={handleOtherOptionHover} className='hover:font-semibold'>Start</Link>
                    </li>

                    {!user && (
                        <>
                            <li id='navigation-option-login' className='mr-5 flex items-center'>
                                <Link to="/login" className='hover:font-semibold'>Login</Link>
                            </li>
                            <li id='navigation-option-register' className='flex items-center'>
                                <Link to="/register" className='hover:font-semibold'>Register</Link>
                            </li>
                        </>
                    )}

                    {user && (
                        <>
                            {/* REWRITE TO AVOID COPYING CODE - object with code definitions (e.g. transfers) and map to human readable (e.g. Przelewy) */}
                            <Dropdown
                                title="Przelewy"
                                options={transferSubmenuOptions}
                                isOpen={activeDropdown === 'przelewy'}
                                isPersistent={persistentDropdown === 'przelewy'}
                                onToggle={() => handleDropdownToggle('przelewy')}
                                onHover={() => handleDropdownHover('przelewy')}
                                onMouseLeave={() => handleMouseLeave('przelewy')}
                                onOptionClick={() => handleOptionClick()}
                                id='navigation-option-transfer'
                                className='mr-5 flex items-center'
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
                                id='settings'
                                className='mr-5 flex items-center' 
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
                                id='finance'
                                className='mr-5 flex items-center'
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
                                id='customer-service'
                                className={`${user.role === 'ADMIN' ? 'mr-5' : ''} flex items-center`}
                            />

                            {user.role === 'ADMIN' && (
                                <li id='navigation-option-admin-panel' className='flex items-center'>
                                    <Link to="\login" onMouseEnter={handleOtherOptionHover} className='hover:font-semibold'>Panel administratora</Link>
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
