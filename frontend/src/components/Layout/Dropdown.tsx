import { Navbar } from 'flowbite-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { blackTextTheme } from './NavbarLinkBlackText';
import { MenuOptionWithSubmenu } from './MainMenu/MainMenuData';
import { useTranslation } from 'react-i18next';

interface DropdownProps {
    menu: MenuOptionWithSubmenu;
    isOpen: boolean;
    onClick: () => void;
    closeDropdown: () => void;
    className: string;
    isMenuPriorityVisible: boolean | undefined;
    pagesToHighlight: string[] | undefined;
}

export const Dropdown: React.FC<DropdownProps> = ({ menu, isOpen, onClick, closeDropdown, className, isMenuPriorityVisible, pagesToHighlight }) => {
    const { t } = useTranslation();
    return (
        <li className={`${className} relative`}>
            <button
                id={menu.id}
                onClick={onClick}
                className="flex items-center justify-between w-full py-2 px-3 text-gray-900 rounded bg-transparent md:p-0 md:w-auto dark:text-gray-400 dark:hover:text-blue-500 dark:focus:text-white dark:border-gray-700 dark:hover:bg-gray-700 md:dark:hover:bg-transparent"
            >
                <span className="flex items-center font-normal hover:font-semibold md:hover:dark:text-white">
                    {t('menu.' + menu.key + '.title')}
                    <svg className="w-2.5 h-2.5 ms-1 transition-transform duration-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(360deg)' }}>
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                    </svg>
                </span>
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gray-100 dark:bg-gray-700 md:hidden"></div>
            </button>

            <ul
                className={`transition-all
                    duration-300
                    ease-in-out
                    transform
                    overflow-hidden
                    ${isOpen ? 'max-h-[500px]' : 'max-h-0'}
                    left-0
                    md:left-1/2
                    md:-translate-x-1/2
                    w-full
                    block
                    md:absolute
                    md:text-nowrap
                    md:w-fit
                    md:min-w-32
                    md:bg-white
                    md:dark:bg-gray-700
                    md:border-gray-300
                    md:dark:border-gray-700
                    md:rounded
                    md:shadow-lg
                    md:mt-2`}
            >
                {menu.submenu.map((option) => (
                    <div className='hover:bg-gray-200 dark:hover:bg-gray-500'>
                        <Navbar.Link 
                            id={option.id} 
                            key={option.key} 
                            as={Link} 
                            to={option.path} 
                            theme={blackTextTheme} 
                            onClick={closeDropdown} 
                            className={`block list-none text-center md:hover:font-semibold text-sm hover:bg-gray-200 hover:dark:bg-gray-600 font-normal hover:font-semibold md:p-2 ${isMenuPriorityVisible && pagesToHighlight != undefined && pagesToHighlight.includes(option.path) ? 'font-bold' : 'font-normal'}`}>
                            {t('menu.' + menu.key + '.submenu.' + option.key)}
                        </Navbar.Link>
                    </div>
                ))}
            </ul>
        </li>
    );
};
