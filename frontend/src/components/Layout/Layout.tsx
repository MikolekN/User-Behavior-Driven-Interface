import React, { useEffect, useState } from 'react';
import Logo from './Logo';
import Profile from './UserProfile';
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
        <div id='layout-wrapper' className='flex flex-col h-screen'>
            <header id='layout-header' className="flex-shrink-0 flex justify-between items-center px-5 relative h-10 my-2">
                <Logo/>
                {isSmallView && (
                    <button id='hamburger-button' onClick={toggleMenu} className="block md:hidden text-2xl bg-transparent border-0 cursor-pointer"> 
                        ☰
                    </button>
                )}
                <MainMenu isOpen={isMenuOpen || !isSmallView} />
                <Profile/>
            </header>
            <main id='layout-content-area' className='grid flex-grow overflow-y-auto'>
                {children}
            </main>
        </div>
    );
};
export default Layout;