import { Navbar } from 'flowbite-react';
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { blackTextTheme } from './NavbarLinkBlackText';

interface DropdownProps {
    title: string;
    options: { label: string; path: string }[];
    isOpen: boolean;
    onClick: () => void;
    className: string;
}

const Dropdown: React.FC<DropdownProps> = ({ title, options, isOpen, onClick, className }) => {
    return (
        <li className={`${className} relative`}>
            <button
                onClick={onClick}
                className="flex items-center justify-between w-full py-2 px-3 text-gray-900 rounded bg-transparent md:p-0 md:w-auto dark:text-gray-400 dark:hover:text-blue-500 dark:focus:text-white dark:border-gray-700 dark:hover:bg-gray-700 md:dark:hover:bg-transparent"
            >
                <span className="flex items-center font-normal hover:font-semibold md:hover:dark:text-white">
                    {title}
                    <svg
                        className="w-2.5 h-2.5 ms-1 transition-transform duration-300"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 10 6"
                        style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(360deg)' }}
                    >
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                    </svg>
                </span>
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gray-100 dark:bg-gray-700 md:hidden"></div>
            </button>

            {isOpen && (
                <ul className="left-0 w-full block md:-translate-x-1/4 md:absolute md:text-nowrap md:w-fit md:bg-white md:dark:bg-gray-700 md:border md:border-gray-300 md:dark:border-gray-700 md:rounded md:shadow-lg md:mt-2">
                    {options.map((option) => (
                        <li key={option.label}
                            className="block list-none text-center md:hover:font-semibold  text-sm hover:bg-gray-200 hover:dark:bg-gray-600 md:p-2">
                            <Navbar.Link as={Link} to={option.path} theme={blackTextTheme} className="font-normal hover:font-semibold">
                                {option.label}
                            </Navbar.Link>
                        </li>
                    ))}
                </ul>
            )}
        </li>
    );
};

export default Dropdown;
