import React, { useState } from 'react';
import "./MainMenu.css"
import { Link } from 'react-router-dom';
import Dropdown from '../Dropdown/Dropdown.tsx';

interface MainMenuProps {
    isLoggedIn: boolean;
}

const MainMenu: React.FC<MainMenuProps> = ({ isLoggedIn }) => {
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
                    
                    {!isLoggedIn && (
                    <>
                        <li className='nav-list-option'>
                            <Link to="/login">Login</Link>
                        </li>
                        <li className='nav-list-option'>
                            <Link to="/register">Register</Link>
                        </li>
                    </>
                    )}

                    {isLoggedIn && (
                    <>
                        <Dropdown
                        title="Przelewy"
                        options={[
                            { label: 'Wykonaj przelew', path: '/' },
                            { label: 'Historia przelewów', path: '/' },
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
                            { label: 'Analizy miesięczne', path: '/' },
                            { label: 'Analizy roczne', path: '/' },
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