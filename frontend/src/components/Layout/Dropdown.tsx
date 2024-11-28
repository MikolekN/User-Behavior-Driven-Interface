import { Navbar } from 'flowbite-react';
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

interface DropdownProps {
    title: string;
    options: { label: string; path: string }[];
    isOpen: boolean;
    isPersistent: boolean;
    onToggle: () => void;
    onHover: () => void;
    onMouseLeave: () => void;
    onOptionClick: () => void;
    className: string;
}

const Dropdown: React.FC<DropdownProps> = ({ title, options, isOpen, isPersistent, onToggle, onHover, onMouseLeave, onOptionClick, className}) => {
    const dropdownRef = useRef<HTMLLIElement>(null);
    const contentRef = useRef<HTMLUListElement>(null);
    const [contentHeight, setContentHeight] = useState<string>('0px');
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                onToggle();
            }
        };

        if (isPersistent) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isPersistent, onToggle]);

    useEffect(() => {
        if (isOpen && contentRef.current) {
            setContentHeight(`${contentRef.current.scrollHeight}px`);
        } else {
            setContentHeight('0px');
        }
    }, [isOpen]);

    return (
        <li
            ref={dropdownRef}
            className={`${className} relative hover:font-semibold`}
            onMouseEnter={onHover}
            onMouseLeave={onMouseLeave}
        >
            <button
                onClick={onToggle}
                className="flex items-center justify-between w-full py-2 px-3 text-gray-900 rounded md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:w-auto dark:text-gray-400 md:dark:hover:text-blue-500 dark:focus:text-white dark:border-gray-700 dark:hover:bg-gray-700 md:dark:hover:bg-transparent"
            >
                <span className="flex items-center font-normal">
                    {title}
                    <svg
                        className="w-2.5 h-2.5 ms-1 transition-transform duration-300"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 10 6"
                        style={{
                            transform: isOpen ? 'rotate(180deg)' : 'rotate(360deg)',
                        }}
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="m1 1 4 4 4-4"
                        />
                    </svg>
                </span>
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gray-100 dark:bg-gray-700"></div>
            </button>

            <ul
                ref={contentRef}
                style={{
                    maxHeight: contentHeight,
                    overflow: 'hidden',
                    transition: 'max-height 0.3s ease',
                }}
                className="block"
            >
                {options.map((option) => (
                    <li
                        className="block list-none text-center m-0 hover:font-semibold text-sm"
                        key={option.label}
                        onClick={onOptionClick}
                    >
                        <Navbar.Link
                            as={Link}
                            to={option.path}
                            className="block p-2 hover:bg-gray-100 font-normal"
                            onClick={(e) => {
                                e.stopPropagation();
                                onOptionClick();
                            }}
                        >
                            {option.label}
                        </Navbar.Link>
                    </li>
                ))}
            </ul>
        </li>
    );
};

export default Dropdown;
