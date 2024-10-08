import { FieldError, UseFormRegisterReturn } from 'react-hook-form';
import './FormInput.css';
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
    return (
        <div>
            <label className="text-sm font-semibold text-gray-700 block">{label}</label>
            <input
                {...register}
                style={{ borderColor: error ? 'red' : '' }}
                type={fieldType}
                className={`${className} p-3 border border-gray-300 rounded-lg mt-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {children}
            {error && <p className="text-red-600 mt-1 text-sm">{error.message}</p>}
        </div>
    );
};

export default FormInput;
