import { useContext, useEffect, useState } from "react";
import { Dropdown, Avatar } from "flowbite-react"
import { useNavigate } from "react-router-dom";

import defaultIcon from '../../assets/images/user.png';
import { UserContext } from '../../context/UserContext';
import { UserIconContext } from '../../context/UserIconContext';
import { AuthContext } from "../../context/AuthContext";

export const UserProfile = () => {
    const navigate = useNavigate();

    const { user } = useContext(UserContext);
    const { logout } = useContext(AuthContext);
    const { getIcon } = useContext(UserIconContext);

    const [iconSrc, setIconSrc] = useState<string>(defaultIcon);

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

    return (<div className="flex md:order-2">
        <Dropdown arrowIcon={false} inline
            label={
                <Avatar alt="User profile icon" img={iconSrc} rounded className='rounded-full hover:bg-gray-200 transition ease-in-out duration-300'/>
            }
        >

        {!user && (
            <>
                <Dropdown.Item href="/login">Login</Dropdown.Item>
                <Dropdown.Item href="/register">Register</Dropdown.Item>
            </>
        )}

        {user && (
            <>
                <Dropdown.Header>
                    <span className="block text-sm">{user?.login}</span>
                    <span className="block truncate text-sm font-medium">{user?.email}</span>
                </Dropdown.Header>
                <Dropdown.Item href="/profile">Profile</Dropdown.Item>
                <Dropdown.Item>Settings</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item href="/" onClick={handleLogout}>Logout</Dropdown.Item>
            </>
        )}
        </Dropdown>
    </div>);
}