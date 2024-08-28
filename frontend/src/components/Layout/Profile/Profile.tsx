import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Profile.css';
import icon from '../../../assets/images/user.png';

interface ProfileProps {
    isLoggedIn: boolean;
    setIsLoggedIn: (loggedIn: boolean) => void;
    setUsername: (username: string) => void;
}

const Profile: React.FC<ProfileProps>  = ({ isLoggedIn, setIsLoggedIn, setUsername }) => {
    const handleLogout = () => {
        setIsLoggedIn(false);
        setUsername("");
    };

    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <div className="profile-container">
            <button className="profile-button" onClick={toggleDropdown}>
                <img src={icon} alt="Profile" className="profile-icon" />
            </button>
            {dropdownOpen && (
                <ul className="profile-dropdown">
                    {!isLoggedIn && (
                        <>
                            <li className='profile-dropdown-option'>
                                <Link to='/login'>Login</Link>
                            </li>
                            <li className='profile-dropdown-option'>
                                <Link to='/register'>Register</Link>
                            </li>
                        </>
                    )}
                    {isLoggedIn && (
                        <>
                            <li className='profile-dropdown-option'>
                                <Link to="/profile">Profile</Link>
                            </li>
                            <li className='profile-dropdown-option'>
                                <Link to='/logout' onClick={handleLogout}>Logout</Link>
                            </li>
                        </>
                    )}
                </ul>
            )}
        </div>
    );
};

export default Profile;
