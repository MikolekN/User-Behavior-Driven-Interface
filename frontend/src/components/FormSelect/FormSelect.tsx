import { FieldError, UseFormRegisterReturn } from 'react-hook-form';
import { ReactNode } from 'react';

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
            <label className="text-sm font-semibold text-gray-700 block">{label}</label>
            <select
                {...register}
                style={{ borderColor: error ? 'red' : '' }}
                className={`${className} p-3 border border-gray-300 rounded-lg mt-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
                <option value="">{defaultOption}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {children}
            {error && <p className="text-red-600 mt-1 text-sm">{error.message}</p>}
        </div>
    );
}

export default FormSelect;
