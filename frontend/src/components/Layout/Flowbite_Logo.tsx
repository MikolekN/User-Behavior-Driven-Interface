import { Navbar } from 'flowbite-react';
import logo from '../../assets/images/logo.png';

export const Logo = () => {
    return (
        <Navbar.Brand href="/dashboard">
            <img src={logo} className="mr-3 h-6 sm:h-9" alt="Logo" />
            <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Bank</span>
        </Navbar.Brand>
    );
};
