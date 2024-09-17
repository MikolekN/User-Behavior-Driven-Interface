import React, { useState } from 'react';
import "./MainMenu.css"
import { Link } from 'react-router-dom';
import Dropdown from '../Dropdown/Dropdown.tsx';
import { User } from '../../utils/User.tsx';

interface MainMenuProps {
    user: User | null;
}

const MainMenu: React.FC<MainMenuProps> = ({ user }) => {
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [persistentDropdown, setPersistentDropdown] = useState<string | null>(null);
  
    const handleDropdownToggle = (dropdownName: string) => {
		if (persistentDropdown === dropdownName) {
			setPersistentDropdown(null);
			setActiveDropdown(null);
		} else {
			setPersistentDropdown(dropdownName);
			setActiveDropdown(dropdownName);
		}
    };
  
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
    }
  
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
                        options={[
                            { label: 'Wykonaj przelew', path: '/transfer' },
                            { label: 'Historia przelewów', path: '/transactions/history' },
                            { label: 'Płatności cykliczne', path: '/' },
                            { label: 'Pożyczki', path: '/' },
                        ]}
                        isOpen={activeDropdown === 'przelewy'}
                        isPersistent={persistentDropdown === 'przelewy'}
                        onToggle={() => handleDropdownToggle('przelewy')}
                        onHover={() => handleDropdownHover('przelewy')}
                        onMouseLeave={() => handleMouseLeave('przelewy')}
                        />

                        <Dropdown
                        title="Ustawienia"
                        options={[
                            { label: 'Ustawienia1', path: '/' },
                            { label: 'Ustawienia2', path: '/' },
                        ]}
                        isOpen={activeDropdown === 'ustawienia'}
                        isPersistent={persistentDropdown === 'ustawienia'}
                        onToggle={() => handleDropdownToggle('ustawienia')}
                        onHover={() => handleDropdownHover('ustawienia')}
                        onMouseLeave={() => handleMouseLeave('ustawienia')}
                        />

                        <Dropdown
                        title="Finanse"
                        options={[
                            { label: 'Analizy miesięczne', path: '/transactions/analysis/monthly' },
                            { label: 'Analizy roczne', path: '/transactions/analysis/yearly' },
                        ]}
                        isOpen={activeDropdown === 'finanse'}
                        isPersistent={persistentDropdown === 'finanse'}
                        onToggle={() => handleDropdownToggle('finanse')}
                        onHover={() => handleDropdownHover('finanse')}
                        onMouseLeave={() => handleMouseLeave('finanse')}
                        />
                        
                        <Dropdown
                        title="Obsługa klienta"
                        options={[
                            { label: 'Czat', path: '/chat' },
                            { label: 'Najczęściej zadawane pytania', path: '/faq' },
                            { label: 'Kontakt', path: '/info' },
                        ]}
                        isOpen={activeDropdown === 'obsługa_klienta'}
                        isPersistent={persistentDropdown === 'obsługa_klienta'}
                        onToggle={() => handleDropdownToggle('obsługa_klienta')}
                        onHover={() => handleDropdownHover('obsługa_klienta')}
                        onMouseLeave={() => handleMouseLeave('obsługa_klienta')}
                        />

                        <li className='nav-list-option'>
                            <Link to="\login" onMouseEnter={handleOtherOptionHover}>Panel administratora</Link>
                        </li>
                    </>
                    )}
                </ul>
            </nav>
        </div>
    );
}

export default MainMenu;