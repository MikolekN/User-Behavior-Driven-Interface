import { FieldError, UseFormRegisterReturn } from 'react-hook-form';
import { ReactNode } from 'react';
import Label from '../utils/Label';
import ErrorMessage from '../utils/ErrorMessage';

interface Option {
    value: string;
    label: string;
}

interface FormSelectProps {
    label: string;
    options: Option[];
    register: UseFormRegisterReturn;
    error?: FieldError;
    defaultOption?: string;
    children?: ReactNode;
    className?: string;
}

const FormSelect = ({ label, options, register, error, defaultOption = '-- Wybierz opcję --', children, className }: FormSelectProps) => {
    return (
        <div>
            <Label label={label} />
            <select
                {...register}
                className={`${className} p-3 border border-gray-300 rounded-lg mt-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-300' : ''}`}
            >
                <option value="">{defaultOption}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {children}
            {error && 
                <ErrorMessage message={error.message} />
            }
        </div>
    );
};

export default FormSelect;
