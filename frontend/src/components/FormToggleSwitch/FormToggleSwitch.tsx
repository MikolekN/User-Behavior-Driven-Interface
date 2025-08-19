import { UseFormRegisterReturn } from 'react-hook-form';
import { ReactNode } from 'react';
import Label from '../utils/Label';
import { ToggleSwitch } from 'flowbite-react';

interface FormInputProps {
    label: string;
    register: UseFormRegisterReturn;
    children?: ReactNode;
    className?: string;
    autocomplete?: string;
}

const FormToggleSwitch = ({ label, register, children, className, autocomplete }: FormInputProps) => {
    const roundedClass = children ? 'rounded-l-lg' : 'rounded-lg';

    return (
        <div className="mb-4">
            <div className={`flex items-center`}>
                <label className="inline-flex items-center mb-5 cursor-pointer gap-4">
                    <Label label={label} />
                    <input {...register} type="checkbox" value="" className="sr-only peer" />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                </label>
                {children && (
                    <div
                        className="p-3 text-gray-700 dark:text-gray-400 bg-gray-300 dark:bg-gray-800 rounded-r-md" 
                        style={{ width: '60px', textAlign: 'center' }}
                    >
                        {children}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FormToggleSwitch;
