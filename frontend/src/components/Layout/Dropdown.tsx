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
        }

        return () => document.removeEventListener('mousedown', handleClickOutside);
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
            <Navbar.Link onClick={() => {}} className={`cursor-pointer ${isPersistent ? 'font-semibold' : 'font-normal'} hover:font-semibold hover:text-black`}>
                <span className={`flex items-center`}>
                    {title}
                    <svg className="w-2.5 h-2.5 ms-1 transition-transform duration-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6" style={{
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(360deg)'
                    }}>
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                    </svg>
                </span>
            </Navbar.Link>
            
            {isOpen && (
                <ul id={`navigation-dropdown-list-${id}`} className="block whitespace-nowrap absolute top-full left-1/2 -translate-x-1/2 z-10 pb-2 max-w-max">
                    {options.map((option) => (
                        <li
                            id={`navigation-dropdown-item-${option.label}`}
                            className='block list-none cursor-pointer text-center m-0 hover:font-semibold text-sm'
                            key={option.label}
                            onClick={() => {
                                onOptionClick();
                            }}
                        >
                            <Navbar.Link as={Link} to={option.path}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onOptionClick();
                                }}>
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
