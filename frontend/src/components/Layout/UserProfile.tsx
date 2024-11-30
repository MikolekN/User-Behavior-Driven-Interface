import { useContext, useEffect, useState } from "react";
import { Dropdown, Avatar } from "flowbite-react"
import { Link, useNavigate } from "react-router-dom";

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

    const DropdownItem:React.FC<{label: string, path: string, onClick?: () => Promise<void>}> = ({label, path, onClick}) => {
        return (
            <Dropdown.Item as={Link} to={path} onClick={onClick} className='block bg-transparent text-black font-normal hover:font-semibold hover:text-black'>
                {label}
            </Dropdown.Item>
        )
    }

    return (<div className="flex order-3 md:order-3">
        <Dropdown arrowIcon={false} inline placement="bottom"
            label={
                <Avatar alt="User profile icon" img={iconSrc} rounded className='rounded-full hover:bg-gray-200 hover:dark:bg-gray-700 transition ease-in-out duration-300'/>
            }
        >

        {!user && (
            <>
                <DropdownItem label="Login" path="/login" />
                <DropdownItem label="Register" path="/register" />
            </>
        )}

        {user && (
            <>
                <Dropdown.Header>
                    <span className="block text-sm">{user?.login}</span>
                    <span className="block truncate text-sm font-medium">{user?.email}</span>
                </Dropdown.Header>
                <DropdownItem label="Profile" path="/profile" />
                <DropdownItem label="Settings" path="/settings" />
                <Dropdown.Divider />
                <DropdownItem label="Logout" path="/" onClick={handleLogout}/>
            </>
        )}
        </Dropdown>
    </div>);
}
