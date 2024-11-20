import { ReactElement, ReactNode } from 'react';

interface ButtonProps {
    children: ReactNode | ReactElement;
    onClick?: () => void;
    className?: string
    isSubmitting?: boolean
}

const Button = ({ children, onClick, className = '', isSubmitting }: ButtonProps) => {
    return (
        <button disabled={isSubmitting} onClick={onClick} className={`${className} py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}>
            {children}
        </button>
    );
};

export default Button;