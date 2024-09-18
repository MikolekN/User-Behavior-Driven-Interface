import { useState, useContext } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Navigate, useNavigate } from 'react-router-dom';
import Tile from '../components/Tile/Tile';
import './Form.css';
import FormInput from '../components/FormInput/FormInput';
import Button from '../components/utils/Button';
import '../components/utils/validationRules';
import { formValidationRules } from '../components/utils/validationRules';
import { AuthContext } from '../context/AuthContext';

interface RegisterFormData {
  email: string,
  password: string,
  confirmPassword: string
}

const Register = () => {
    const [ apiError, setApiError ] = useState({isError: false, errorMessage: ""});
    const { user, register } = useContext(AuthContext) || { user: null, fetchUser: () => Promise.resolve() };
    const { register: formRegister, control, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: ""
        },
        mode: "onSubmit"
    });
    const password = useWatch({
    control,
    name: "password",
    defaultValue: "",
    });
    const navigate = useNavigate();

    if (user) return <Navigate to="/dashboard" />;

    const onSubmit = handleSubmit(async ({ email, password }) => {
        try {
            await register(email, password);
            navigate('/login');
        } catch (error) {
        if (error instanceof Error) {
            setApiError({
                isError: true,
                errorMessage: error.message
            });
        } else {
            setApiError({
                isError: true,
                errorMessage: 'An unknown error occurred. Please try again.'
            });
        }
        console.log(error);
        }
    });

    return (
        <div className="flex items-center justify-center">
        <Tile title="Register to Online Banking" className="form-tile w-2/5 bg-white p-8 border border-gray-300 rounded-lg shadow-lg">
            <div className="flex items-center justify-center">
            <div className="max-w-md w-full mx-auto">
                <form className="mt-8 space-y-6" onSubmit={onSubmit}>
                <FormInput 
                    label="Email"
                    fieldType="text"
                    register={formRegister('email', {
                    required: formValidationRules.email.required,
                    pattern: formValidationRules.email.pattern
                    })}
                    error={errors.email}
                    className="w-full"
                />
                <FormInput 
                    label="Password"
                    fieldType="password"
                    register={formRegister('password', {
                    required: formValidationRules.password.required,
                    validate: formValidationRules.password.validate
                    })}
                    error={errors.password}
                    className="w-full"
                />
                <FormInput 
                    label="Confirm Password"
                    fieldType="password"
                    register={formRegister('confirmPassword', {
                    required: formValidationRules.confirmPassword.required,
                    validate: {
                        matchPasswords: (value: string) => value === password || 'Passwords do not match'
                    }
                    })}
                    error={errors.confirmPassword}
                    className="w-full"
                />
                <Button className="w-full">
                    Submit
                </Button>
                <div>
                    {apiError.isError && <p className="text-red-600 mt-1 text-sm">{apiError.errorMessage}</p>}
                </div>
                </form>
            </div>
            </div>
        </Tile>
        </div>
    );
};

export default Register;
