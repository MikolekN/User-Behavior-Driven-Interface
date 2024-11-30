import React from 'react';
import { MegaMenu, Navbar } from 'flowbite-react';
import { UserProfile } from './UserProfile';
import { Logo } from './Logo';
import { MainMenu } from './MainMenu/MainMenu';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div id='layout-wrapper' className='flex flex-col h-screen'>
            <header id='layout-header'>
                <MegaMenu className='bg-inherit'>
                    <Logo />
                    <UserProfile />
                    <Navbar.Toggle className="order-1 md:order-2" />
                    <MainMenu />
                </MegaMenu>
            </header>
            <main id='layout-content-area' className='grid flex-grow overflow-y-auto'>
                {children}
            </main>
            <footer id="layout-footer" className="dark:bg-gray-800 dark:text-gray-400 text-center py-1 text-sm">
                <div>© 2024 Bank. All rights reserved.</div>
            </footer>
        </div>
    );
};
