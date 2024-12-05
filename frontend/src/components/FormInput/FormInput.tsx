import { FieldError, UseFormRegisterReturn } from 'react-hook-form';
import { ReactNode } from 'react';
import Label from '../utils/Label';
import ErrorMessage from '../utils/ErrorMessage';

interface FormInputProps {
    label: string;
    fieldType: string;
    register: UseFormRegisterReturn;
    error?: FieldError;
    children?: ReactNode;
    className?: string;
}

const FormInput = ({ label, fieldType, register, error, children, className }: FormInputProps) => {
    const roundedClass = children ? 'rounded-l-lg' : 'rounded-lg';

    return (
        <div className="mb-4">
            <Label label={label} />
            <div className={`flex items-center rounded-lg border border-gray-300 dark:border-gray-600 ${error ? 'border-red-500 focus-within:ring-2 focus-within:ring-red-500' : 'focus-within:ring-2 focus-within:ring-gray-300 dark:focus-within:ring-gray-600'}`}>
                <input
                    {...register}
                    type={fieldType}
                    className={`flex-grow p-3 ${roundedClass} ${className} border-0 focus:ring-0 bg-white dark:bg-gray-800 text-black dark:text-gray-400 ${error ? 'text-red-500 dark:text-red-500' : ''}`}
                />
                {children && (
                    <div
                        className="p-3 text-gray-700 dark:text-gray-400 bg-gray-300 dark:bg-gray-800 rounded-r-md" 
                        style={{ width: '60px', textAlign: 'center' }}
                    >
                        {children}
                    </div>
                )}
            </div>
            {error && 
                <ErrorMessage message={error.message} />
            }
        </div>
    );
};

export default FormInput;
