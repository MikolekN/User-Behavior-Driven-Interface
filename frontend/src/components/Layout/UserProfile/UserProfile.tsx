import { useState, useEffect, useRef, useContext, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './UserProfile.css';
import defaultIcon from '../../../assets/images/user.png';
import { UserContext } from '../../../context/UserContext';
import { AuthContext } from '../../../context/AuthContext';
import { UserIconContext } from '../../../context/UserIconContext';

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
        await logout();
        navigate('/');
    };

    useEffect(() => {
        const fetchIcon = async () => {
            if (user && !user.icon) {
                await getIcon();
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
        <div className="profile-container" ref={profileRef}>
            <button className="profile-button" onClick={toggleDropdown}>
                <img 
                    src={iconSrc} 
                    id="ProfileIcon"
                    alt="Profile" 
                    className="profile-icon"           
                />
            </button>
            {dropdownOpen && (
                <ul className="profile-dropdown">
                    {!user && (
                        <>
                            <li className='profile-dropdown-option'>
                                <Link to='/login'>Login</Link>
                            </li>
                            <li className='profile-dropdown-option'>
                                <Link to='/register'>Register</Link>
                            </li>
                        </>
                    )}
                    {user && (
                        <>
                            <li className='profile-dropdown-option'>
                                <Link to="/profile" onClick={toggleDropdown}>Profile</Link>
                            </li>
                            <li className='profile-dropdown-option'>
                                <Link to='/' onClick={() => {
                                    toggleDropdown();
                                    void handleLogout();
                                }}>Logout</Link>
                            </li>
                        </>
                    )}
                </ul>
            )}
        </div>
    );
};

export default Profile;
