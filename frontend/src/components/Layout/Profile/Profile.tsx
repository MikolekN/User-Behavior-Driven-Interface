import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Profile.css';
import icon from '../../../assets/images/user.png';
import { useNavigate } from 'react-router-dom';
import { User } from '../../utils/User';

interface ProfileProps {
    user: User | null;
    setUser: (user: User | null) => void;
}

const Profile: React.FC<ProfileProps>  = ({ user, setUser }) => {
    const navigate = useNavigate();
    const handleLogout = async () => {
        setUser(null);
        try {
            await fetch("http://127.0.0.1:5000/api/logout", {
              method: "POST",
              credentials: 'include'
            });
        }
        catch (error) {
        console.log(error);
        }
        navigate('/');
    };

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
                                <Link to="/profile">Profile</Link>
                            </li>
                            <li className='profile-dropdown-option'>
                                <Link to='/' onClick={handleLogout}>Logout</Link>
                            </li>
                        </>
                    )}
                </ul>
            )}
        </div>
    );
};

export default Profile;
