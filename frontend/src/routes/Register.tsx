import { useForm, useWatch } from 'react-hook-form'

interface RegisterFormData {
    email: string,
    password: string,
    confirmPassword: string
}

const validateRegisterForm = {
    email: {
        required: true,
        pattern: {
            value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
            message: 'Invalid email address',
        }
    },
    password: {
        required: true,
        validate: {
            checkLength: (value: string) => value.length >= 6,
            matchPattern: (value: string) =>
                /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s)(?=.*[!@#$*])/.test(value)
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
        })

    const password = useWatch({
        control,
        name: "password", // without supply name will watch the entire form, or ['firstName', 'lastName'] to watch both
        defaultValue: "default", // default value before the render
    })

    const onSubmit = handleSubmit(({ email, password }) => {
    // finish handling login submit by sending it to backend and necessary validation
        console.log(email, password)
    })

    return (
    <div className="min-h-screen flex flex-col justify-center">
        <div className="max-w-md w-full mx-auto mt-4 bg-white p-8 border-gray-600">
        <div className="max-w-md w-full mx-auto mb-4">
            <div className="text-center font-medium text.xl">
            Register Form
            </div>
        </div>
            <form action="" className="space-y-6" onSubmit={onSubmit}>
            <div>
                <label htmlFor="" className="text-sm font-bold text-gray-600 block">Email</label>
                <input {...register('email', validateRegisterForm.email)}
                style={{borderColor: errors.email ? "red": ""}}
                name="email" type="text" className="w-full p-2 border border-gray-300 rounded mt-1 bg-white"/>
                {errors.email?.type === "required" &&   (
                    <p className="text-gray-600">Email is required</p>
                )}
                {errors.email?.type === "pattern" &&   (
                    <p className="text-gray-600">Invalid email format</p>
                )}
            </div>
            <div>
                <label htmlFor="" className="text-sm font-bold text-gray-600 block">Password</label>
                <input 
                {...register("password", validateRegisterForm.password)} 
                name="password" type="password" className="w-full p-2 border border-gray-300 rounded mt-1 bg-white"/>
                {errors.password?.type === "required" && (
                    <p className="errorMsg">Password is required.</p>
                )}
                {errors.password?.type === "checkLength" && (
                    <p className="errorMsg">Password should be at-least 6 characters.</p>
                )}
                {errors.password?.type === "matchPattern" && (
                    <p className="errorMsg">Password should contain at least one uppercase letter, lowercase letter, digit, and special symbol.</p>
                )}
            </div>
            <div>
                <label htmlFor="" className="text-sm font-bold text-gray-600 block">Repeat Password</label>
                <input {...register("confirmPassword", {
                    required: true,
                    validate: {
                        matchPasswords: (value: string) => password === value
                    }
                })} 
                name="confirmPassword" type="password" className="w-full p-2 border border-gray-300 rounded mt-1 bg-white"/>
                {errors.confirmPassword?.type === "required" && (
                    <p className="errorMsg">Password is required.</p>
                )}
                {errors.confirmPassword?.type === "matchPasswords" && (
                    <p className="errorMsg">Passwords do not match</p>
                )}
            </div>
            <div>
                <button className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-md text-white text-sm">Submit</button>
            </div>
            </form>
        </div>
    </div>
    )
}


export default Register