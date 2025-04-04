import { FieldError, UseFormRegisterReturn } from 'react-hook-form';
import { ReactNode } from 'react';
import Label from '../utils/Label';
import ErrorMessage from '../utils/ErrorMessage';
import { t } from 'i18next';

interface FormInputProps {
    label: string;
    fieldType: string;
    register: UseFormRegisterReturn;
    error?: FieldError;
    children?: ReactNode;
    className?: string;
    autocomplete?: string;
}

const getZodValidationErrorFormField = (error?: FieldError): string => {
    const errorSplit: string[] = error!.message!.split(";");
    const fieldName: string = errorSplit[0];
    const fieldRestriction: string = errorSplit[1] || "";

    return (fieldRestriction === "") ? 
        t(`errors.zod.${fieldName}`) : 
        `${t(`errors.zod.${fieldName}`)} ${fieldRestriction}`;
}

const FormInput = ({ label, fieldType, register, error, children, className, autocomplete }: FormInputProps) => {
    const roundedClass = children ? 'rounded-l-lg' : 'rounded-lg';

    return (
        <div className="mb-4">
            <Label label={label} />
            <div className={`flex items-center rounded-lg border border-gray-300 dark:border-gray-600 ${error ? 'border-red-500 focus-within:ring-2 focus-within:ring-red-500' : 'focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-600 focus-within:dark:border-blue-600'}`}>
                <input
                    {...register}
                    type={fieldType}
                    autoComplete={autocomplete}
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
                <ErrorMessage message={getZodValidationErrorFormField(error)} />
            }
        </div>
    );
};

export default FormInput;
