import { FieldError, UseFormRegisterReturn } from 'react-hook-form';
import { ChangeEvent, ReactNode } from 'react';
import Label from '../utils/Label';
import ErrorMessage from '../utils/ErrorMessage';
import { useTranslation } from 'react-i18next';

interface Option {
    value: string;
    key: string;
}

interface FormSelectProps {
    label: string;
    options: Option[];
    register?: UseFormRegisterReturn;
    error?: FieldError;
    defaultValue?: string;
    defaultOption?: string;
    onChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
    children?: ReactNode;
    className?: string;
}

const FormSelect = ({ label, options, register, error, defaultValue, defaultOption, onChange, children, className }: FormSelectProps) => {
    const { t } = useTranslation();
    
    return (
        <div>
            <Label label={label} />
            <select
                {...register}
                className={`${className} text-black dark:text-gray-400 p-3 border border-gray-300 dark:border-gray-600 rounded-lg mt-1 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-300' : ''}`}
                onChange={onChange}
                defaultValue={defaultValue}
            >
                { defaultOption &&
                    <option className='bg-gray-200 dark:bg-gray-800' value="">{defaultOption}</option>
                }
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {t(`formSelect.${option.key}`)}
                    </option>
                ))}
            </select>
            {children}
            {error && 
                <ErrorMessage message={t(`errors.zod.${error.message}`)} />
            }
        </div>
    );
};

export default FormSelect;
