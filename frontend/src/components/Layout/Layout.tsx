import React from 'react';
import './Layout.css';
import Logo from './Logo/Logo.tsx';
import Profile from './Profile/Profile.tsx';
import MainMenu from './MainMenu/MainMenu.tsx';
import { User } from '../utils/User.tsx';

interface LayoutProps {
  user: User | null;
  setUser: (user: User | null) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ user, setUser, children }) => {
  return (
    <div className='layout-wrapper'>
      <header className="layout-header">
        <Logo />

        <MainMenu user={user} />

        <Profile user={user} setUser={setUser} />
      </header>
      <main className="layout-content-area">
        {children}
      </main>
    </div>
  );
};
export default Layout;