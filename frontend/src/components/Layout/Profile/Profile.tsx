import { useState, useEffect, useRef, useContext } from 'react';
import { Link } from 'react-router-dom';
import './Profile.css';
import icon from '../../../assets/images/user.png';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';

const Profile = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);    

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

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
    });

    const handleLogout = async () => {
        logout();
        navigate('/');
    };

    return (
        <div className="profile-container" ref={profileRef}>
            <button className="profile-button" onClick={toggleDropdown}>
                <img src={icon} alt="Profile" className="profile-icon" />
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
                                <Link to="/dashboard" onClick={toggleDropdown}>Profile</Link>
                            </li>
                            <li className='profile-dropdown-option'>
                                <Link to='/' onClick={() => {
                                    toggleDropdown();
                                    handleLogout();
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
