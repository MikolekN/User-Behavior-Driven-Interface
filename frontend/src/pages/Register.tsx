import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Tile from '../components/Tile/Tile';
import './Form.css';
import FormInput from '../components/FormInput/FormInput';
import Button from '../components/utils/Button';
import '../components/utils/validationRules';
import { formValidationRules } from '../components/utils/validationRules';

interface RegisterFormData {
  email: string,
  password: string,
  confirmPassword: string
};

const Register = () => {
  const { register, control, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
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
  const [ apiError, setApiError ] = useState({isError: false, errorMessage: ""});

  const onSubmit = handleSubmit(async ({ email, password }) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          login: email,
          password: password
        })
      });

      const responseJson = await response.json();

      if (response.ok) {
        navigate('/login');
      }
      else {
        setApiError({
          isError: true,
          errorMessage: responseJson.message
        });
        throw new Error(responseJson.message);
      }
    }
    catch (error) {
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
                register={register('email', {
                  required: formValidationRules.email.required,
                  pattern: formValidationRules.email.pattern
                })}
                error={errors.email}
                className="w-full"
              />
              <FormInput 
                label="Password"
                fieldType="password"
                register={register('password', {
                  required: formValidationRules.password.required,
                  validate: formValidationRules.password.validate
                })}
                error={errors.password}
                className="w-full"
              />
              <FormInput 
                label="Confirm Password"
                fieldType="password"
                register={register('confirmPassword', {
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
