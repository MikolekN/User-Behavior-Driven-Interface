import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Layout.css';
import Logo from './Logo/Logo.tsx';
import Profile from './Profile/Profile.tsx';
import Dropdown from './Dropdown/Dropdown.tsx';

interface LayoutProps {
  isLoggedIn: boolean;
  setIsLoggedIn: (loggedIn: boolean) => void;
  username: string;
  setUsername: (username: string) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ isLoggedIn, setIsLoggedIn, username, setUsername, children }) => {
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
  };

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [persistentDropdown, setPersistentDropdown] = useState<string | null>(null);

  const handleDropdownToggle = (dropdownName: string) => {
    if (persistentDropdown === dropdownName) {
      // Close the currently persistent dropdown
      setPersistentDropdown(null);
      setActiveDropdown(null);
    } else {
      // Open the clicked dropdown persistently and close others
      setPersistentDropdown(dropdownName);
      setActiveDropdown(dropdownName);
    }
  };

  const handleDropdownHover = (dropdownName: string) => {
    // Always allow hover to open a dropdown
    setActiveDropdown(dropdownName);
    
    // If hovering over a different dropdown, remove persistence from the previous one
    if (persistentDropdown !== dropdownName) {
      setPersistentDropdown(null);
    }
  };

  const handleMouseLeave = (dropdownName: string) => {
    if (persistentDropdown !== dropdownName) {
      // Close dropdown on mouse leave if it's not persistently open
      setActiveDropdown(null);
    }
  };

  return (
    <div>
      <header className="header">
        <Logo/>

        <nav className="nav">
          <ul className="nav-list">
            <li><Link to="/">Start</Link></li>
            
            {!isLoggedIn && (
              <>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
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

                <li>
                  <Link to="\login">Obsługa klienta</Link>
                </li>
                
                <li>
                  <Link to="\login" onClick={handleLogout}>Panel administratora</Link>
                </li>
              </>
            )}
          </ul>
        </nav>

        <Profile 
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          setUsername={setUsername} 
        />

      </header>
      <main className="grid">
        {children}
      </main>
    </div>
  );
};

export default Layout;
