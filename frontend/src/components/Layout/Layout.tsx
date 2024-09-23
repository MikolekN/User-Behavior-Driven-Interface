import React from 'react';
import './Layout.css';
import Logo from './Logo/Logo.tsx';
import Profile from './Profile/Profile.tsx';
import MainMenu from './MainMenu/MainMenu.tsx';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className='layout-wrapper'>
      <header className="layout-header">
        <Logo/>
        <MainMenu/>
        <Profile/>
      </header>
      <main className="layout-content-area">
        {children}
      </main>
    </div>
  );
};
export default Layout;