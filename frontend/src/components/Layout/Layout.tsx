import React from 'react';
import { MegaMenu, Navbar } from 'flowbite-react';
import { UserProfile } from './UserProfile';
import { Logo } from './Logo';
import { MainMenu } from './MainMenu/MainMenu';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div
            id='layout-wrapper'
            className='flex flex-col min-h-screen h-fit md:h-screen w-full max-w-full'
        >
            <header id='layout-header' className='h-fit w-full max-w-full'>
                <MegaMenu className='bg-transparent'>
                    <Logo />
                    <UserProfile />
                    <Navbar.Toggle className="order-1 md:order-2" />
                    <MainMenu />
                </MegaMenu>
            </header>
            <main
                id='layout-content-area'
                className='flex flex-grow flex-row md:flex-col justify-center items-center w-full max-w-full overflow-hidden'
            >
                {children}
            </main>
            <footer
                id="layout-footer"
                className="bg-transparent text-center py-1 text-xs md:text-sm h-fit w-full max-w-full"
            >
                <div>© 2025 Bank. All rights reserved.</div>
            </footer>
        </div>
    );
};
