import { useState } from 'react';
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
                {/* Replace with your profile icon or avatar */}
                <img src={icon} alt="Profile" className="profile-icon" />
            </button>
            {dropdownOpen && (
                <ul className="profile-dropdown">
                    <li><a href="/profile">Profile</a></li>
                    {!isLoggedIn && (
                        <>
                            <li><a href="/login" onClick={handleLogout}>Login</a></li>
                            <li><a href="/register" onClick={handleLogout}>Register</a></li>
                        </>
                    )}
                    {isLoggedIn && (
                        <>
                            <li><a href="/login" onClick={handleLogout}>Logout</a></li>
                        </>
                    )}
                </ul>
            )}
        </div>
    );
};

export default Profile;
