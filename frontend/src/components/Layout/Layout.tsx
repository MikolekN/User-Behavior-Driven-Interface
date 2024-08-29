import React from 'react';
import './Layout.css';
import Logo from './Logo/Logo.tsx';
import Profile from './Profile/Profile.tsx';
import MainMenu from './MainMenu/MainMenu.tsx';

interface LayoutProps {
  isLoggedIn: boolean;
  setIsLoggedIn: (loggedIn: boolean) => void;
  setUsername: (username: string) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ isLoggedIn, setIsLoggedIn, setUsername, children }) => {
  return (
    <div>
      <header className="header">
        <Logo/>

        <MainMenu 
          isLoggedIn={isLoggedIn}
        />

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
