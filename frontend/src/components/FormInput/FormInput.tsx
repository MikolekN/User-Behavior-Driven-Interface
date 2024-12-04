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
            <div className={`flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 ${error ? 'border-red-300' : ''}`}>
                <input
                    {...register}
                    type={fieldType}
                    className={`flex-grow p-3 bg-white focus:outline-none ${roundedClass} ${className}`}
                    style={{ borderColor: 'transparent' }} // Remove double border
                />
                {children && (
                    <div
                        className="p-3 bg-gray-300 text-gray-700 border-l border-gray-300 rounded-r-md" 
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
