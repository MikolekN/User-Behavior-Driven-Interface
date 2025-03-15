import { Dropdown } from "flowbite-react"
import { Link } from "react-router-dom"

const DropdownItem:React.FC<{id: string, label: string, path: string, icon: string | React.ReactNode, className?: string, onClick?: () => Promise<void>}> = ({id, label, path, icon, className, onClick}) => {
    return (
        <Dropdown.Item id={id} as={Link} to={path} onClick={onClick} className="flex bg-transparent text-black font-normal hover:font-semibold hover:text-black">
            {typeof icon === 'string' ? (
                <img src={icon} className={` ${className} w-5 h-5 mr-1`} />
            ) : (
                <span className={` ${className} w-5 h-5 mr-1 flex items-center justify-center`}>{icon}</span>
            )}
            {label}
        </Dropdown.Item>
    );
};

export default DropdownItem;
