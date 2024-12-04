import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

interface DropdownProps {
    title: string;
    options: {
        id: string; 
        label: string; 
        path: string 
    }[];
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
    const { t } = useTranslation();

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
                {t(`menu.${title}.title`)}
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
                            <Link 
                                to={option.path}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onOptionClick();
                                }}
                                className='py-2 px-4 block hover:font-semibold'
                            >
                                {t(`menu.${title}.submenu.${option.id}`)}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </li>
    );
};

export default Dropdown;
