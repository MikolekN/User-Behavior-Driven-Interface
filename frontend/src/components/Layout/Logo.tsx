import { Navbar } from 'flowbite-react';
import logo from '../../assets/images/logo.png';
import { Link } from 'react-router-dom';

export const Logo = () => {
    return (
        <Navbar.Brand as={Link} to="/">
            <img src={logo} className="mr-3 h-10" alt="Logo" />
            <span className="self-center whitespace-nowrap text-lg font-medium dark:text-white hidden md:block text-black">Bank</span>
        </Navbar.Brand>
    );
};
