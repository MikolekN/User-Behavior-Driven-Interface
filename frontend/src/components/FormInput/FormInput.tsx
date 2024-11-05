import { FieldError, UseFormRegisterReturn } from 'react-hook-form';
import { ReactNode } from 'react';

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
            <label className="text-sm font-semibold text-gray-700 block mb-1">{label}</label>
            <div className={`flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 ${error ? 'border-red-500' : ''}`}>
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
            {error && <p className="text-red-600 mt-1 text-sm">{error.message}</p>}
        </div>
    );
};

export default FormInput;
