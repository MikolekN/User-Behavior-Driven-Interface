import { useForm, useWatch } from 'react-hook-form'

interface RegisterFormData {
  email: string,
  password: string,
  confirmPassword: string
}

const validateRegisterForm = {
  email: {
    required: 'Email is required',
    pattern: {
      value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
      message: 'Invalid email address',
    }
  },
  password: {
    required: 'Password is required',
    validate: {
      checkLength: (value: string) => value.length >= 6 || 'Password should be at least 6 characters',
      matchPattern: (value: string) =>
        /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s)(?=.*[!@#$*])/.test(value) || 'Password should contain at least one uppercase letter, lowercase letter, digit, and special symbol'
    }
  }
};

const Register = () => {
  const { register, control, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: ""
    },
    mode: "onChange"
  });

  const password = useWatch({
    control,
    name: "password",
    defaultValue: "",
  });

  const onSubmit = handleSubmit(({ email, password }) => {
    console.log(email, password);
  });

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full mx-auto bg-white p-8 border border-gray-300 rounded-lg shadow-lg">
        <div className="text-center font-semibold text-2xl mb-6 text-gray-700"> Register to Online Banking </div>
        <form className="space-y-6" onSubmit={onSubmit}>
          <div>
            <label className="text-sm font-semibold text-gray-700 block">Email</label>
            <input
              {...register('email', validateRegisterForm.email)}
              style={{ borderColor: errors.email ? 'red' : '' }}
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg mt-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && <p className="text-red-600 mt-1 text-sm">{errors.email.message}</p>}
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block">Password</label>
            <input
              {...register('password', validateRegisterForm.password)}
              type="password"
              className="w-full p-3 border border-gray-300 rounded-lg mt-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && <p className="text-red-600 mt-1 text-sm">{errors.password.message}</p>}
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block">Confirm Password</label>
            <input
              {...register('confirmPassword', {
                required: 'Confirm Password is required',
                validate: {
                  matchPasswords: (value: string) => value === password || 'Passwords do not match'
                }
              })}
              type="password"
              className="w-full p-3 border border-gray-300 rounded-lg mt-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.confirmPassword && <p className="text-red-600 mt-1 text-sm">{errors.confirmPassword.message}</p>}
          </div>
          <div>
            <button className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
