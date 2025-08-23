import { ReactElement, ReactNode } from 'react';

interface ButtonProps {
    id?: string;
    children: ReactNode | ReactElement;
    onClick?: () => void;
    onSubmit?: () => Promise<void>;
    className?: string;
    isSubmitting?: boolean;
    disabled?: boolean;
}

const Button = ({ id, children, onClick, onSubmit, className = '', isSubmitting, disabled }: ButtonProps) => {
    return (
        <button id={id} disabled={isSubmitting || disabled} onClick={onClick || onSubmit} className={`${className} py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white dark:text-gray-400 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}>
            {children}
        </button>
    );
};

export default Button;