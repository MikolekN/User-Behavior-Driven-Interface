import { Navbar } from 'flowbite-react';
import React, { useEffect, useRef } from 'react';
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
    id: string;
    className: string;
}

const Dropdown: React.FC<DropdownProps> = ({ title, options, isOpen, isPersistent, onToggle, onHover, onMouseLeave, onOptionClick, id, className }) => {
    const dropdownRef = useRef<HTMLLIElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                onToggle();
            }
        };

        if (isPersistent) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isPersistent, onToggle]);

    return (
        <li
            ref={dropdownRef}
            className={`${className} relative`}
            onMouseEnter={onHover}
            onMouseLeave={onMouseLeave}
            onClick={onToggle}
            id={`navigation-option-${id}`}
        >
            <span id={`navigation-dropdown-label-${id}`} className={`cursor-pointer ${isPersistent ? 'font-semibold' : 'font-normal'} hover:font-semibold`}>
                {title}
            </span>
            {isOpen && (
                <ul id={`navigation-dropdown-list-${id}`} className="block whitespace-nowrap absolute top-full left-1/2 -translate-x-1/2 z-10 pb-2 max-w-max">
                    {options.map((option) => (
                        <li
                            id={`navigation-dropdown-item-${option.label}`}
                            className='block list-none cursor-pointer text-center m-0 hover:font-semibold'
                            key={option.label}
                            onClick={() => {
                                onOptionClick();
                            }}
                        >
                            <Navbar.Link>
                                    <Link
                                        to={option.path}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onOptionClick();
                                        }}
                                        className='block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500 dark:bg-blue-600 md:dark:bg-transparent' aria-current="page">
                                            {option.label}
                                    </Link>
                            </Navbar.Link>
                        </li>
                    ))}
                </ul>
            )}
        </li>
    );
};

export default Dropdown;
