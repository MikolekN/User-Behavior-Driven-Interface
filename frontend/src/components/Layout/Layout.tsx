import React, { useEffect, useState } from 'react';
import './Layout.css';
import Logo from './Logo/Logo';
import Profile from './UserProfile/UserProfile';
import MainMenu from './MainMenu/MainMenu';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSmallView, setIsSmallView] = useState(window.innerWidth < 768);
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const handleResize = () => {
        const isNowSmall = window.innerWidth < 768;
        setIsSmallView(isNowSmall);

        if (!isNowSmall) {
            setIsMenuOpen(false);
        }
    };
    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    
    return (
        <div className='layout-wrapper'>
            <header className="layout-header">
                <Logo/>
                {isSmallView && (
                    <button className="hamburger-icon" onClick={toggleMenu}>
                        ☰
                    </button>
                )}
                <MainMenu isOpen={isMenuOpen || !isSmallView} />
                <Profile/>
            </header>
            <main className="layout-content-area">
                {children}
            </main>
        </div>
    );
};
export default Layout;