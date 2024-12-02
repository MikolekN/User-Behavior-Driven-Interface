import { Navbar } from 'flowbite-react';
import logo from '../../assets/images/logo.png';
import { Link } from 'react-router-dom';

export const Logo = () => {
    return (
        <Navbar.Brand as={Link} to="/" className="order-2 md:order-1">
            <img src={logo} className="h-10" alt="Logo" />
            <span className="ml-2 self-center whitespace-nowrap text-lg font-medium dark:text-gray-400 hidden md:block text-black">Bank</span>
        </Navbar.Brand>
    );
};
