import { useState, useEffect, useRef, useContext, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import defaultIcon from '../../assets/images/user.png';
import { UserContext } from '../../context/UserContext';
import { AuthContext } from '../../context/AuthContext';
import { UserIconContext } from '../../context/UserIconContext';

const Profile = () => {
    const { user } = useContext(UserContext);
    const { logout } = useContext(AuthContext);
    const { getIcon } = useContext(UserIconContext);
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);    
    const [iconSrc, setIconSrc] = useState<string>(defaultIcon);

    const toggleDropdown = useCallback(() => {
        setDropdownOpen(!dropdownOpen);
    }, [dropdownOpen]);

    const profileRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                toggleDropdown();
            }
        };

        if (dropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownOpen, toggleDropdown]);

    const handleLogout = async () => {
        try {
            await logout();
        } catch { /* If error occurs it is displayed in console */ } finally {
            navigate('/');
        }
    };

    useEffect(() => {
        const fetchIcon = async () => {
            if (user && !user.icon) {
                try {
                    await getIcon();
                } catch { /* If error occurs it is displayed in console */ }
            }
    
            if (user && user.icon) {
                const iconURL = URL.createObjectURL(user.icon);
                setIconSrc(iconURL);
                return () => {
                    URL.revokeObjectURL(iconURL);
                };
            } else {
                setIconSrc(defaultIcon);
            }
        };
    
        void fetchIcon();
    }, [user, getIcon, user?.icon]);

    return (
        <div id='profile-container' ref={profileRef} className='relative'>
            <div id='profile-menu-container' className='flex items-center space-x-2'>
                <h1 id='profile-user-name' className='text-2xl mx-1'> {user?.login} </h1>
                <button id='profile-button' onClick={toggleDropdown} className='w-10 h-10 rounded-full cursor-pointer overflow-hidden block bg-inherit hover:bg-gray-200 transition ease-in-out duration-300'>
                    <img 
                        src={iconSrc} 
                        id="ProfileIcon"
                        alt="Profile" 
                        className="profile-icon"           
                    />
                </button>
            </div>
            {dropdownOpen && (
                <ul id='profile-dropdown' className='absolute top-full right-0 bg-transparent shadow-md z-10 py-2 text-center list-none'>
                    {!user && (
                        <>
                            <li className='cursor-pointer'>
                                <div>
                                    <Link to='/login' className='py-2 px-4 no-underline block font-normal hover:font-semibold transition-colors duration-500 ease-in-out'>Login</Link>
                                </div>
                            </li>
                            <li className='cursor-pointer'>
                                <Link to='/register' className='py-2 px-4 no-underline block font-normal hover:font-semibold transition-colors duration-500 ease-in-out'>Register</Link>
                            </li>
                        </>
                    )}
                    {user && (
                        <>
                            <li className='cursor-pointer'>
                                <Link to="/profile" onClick={toggleDropdown} className='py-2 px-4 no-underline block font-normal hover:font-semibold transition-colors duration-500 ease-in-out'>Profile</Link>
                            </li>
                            <li className='cursor-pointer'>
                                <Link to='/' onClick={() => {
                                    toggleDropdown();
                                    void handleLogout();
                                }} className='py-2 px-4 no-underline block font-normal hover:font-semibold transition-colors duration-500 ease-in-out'>Logout</Link>
                            </li>
                        </>
                    )}
                </ul>
            )}
        </div>
    );
};

export default Profile;
