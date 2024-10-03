import { FieldError, UseFormRegisterReturn } from 'react-hook-form';
import { ReactNode } from 'react';

interface FormSelectProps {
	label: string;
    options: string[];
	register: UseFormRegisterReturn;
	error?: FieldError,
	children?: ReactNode,
	className?: string
}

const FormSelect = ({ label, options, register, error, children, className }: FormSelectProps) => {
    return (
        <div>
            <label className="text-sm font-semibold text-gray-700 block">{label}</label>
            <select
                {...register}
                style={{ borderColor: error ? 'red' : '' }}
                className={`${className} p-3 border border-gray-300 rounded-lg mt-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
                {options.map((option, idx) => (
                    idx === 0 ? (
                        <option key={idx} value="">
                            {option}
                        </option>
                    ) :
                    <option key={idx} value={option}>
                        {option}
                    </option>
                ))}
            </select>
            {children}
            {error && <p className="text-red-600 mt-1 text-sm">{error.message}</p>}
        </div>
    )
}

export default FormSelect;