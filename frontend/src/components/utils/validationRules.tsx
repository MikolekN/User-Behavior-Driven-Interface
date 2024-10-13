export const formValidationRules = {
    email: {
        required: {
            value: true,
            message: 'Email is required'
        },
        pattern: {
            value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
            message: 'Invalid email address',
        }
    },
    password: {
        required: {
            value: true,
            message: 'Password is required'
        },
        validate: {
            checkLength: (value: string) => value.length >= 6 || 'Password should be at least 6 characters',
            matchPattern: (value: string) =>
                /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s)(?=.*[!@#$*])/.test(value) || 'Password should contain at least one uppercase letter, lowercase letter, digit, and special symbol'
        }
    },
    confirmPassword: {
        required: {
            value: true,
            message: 'Confirm Password is required'
        }
    },
    recipientAccountNumber: {
        required: {
            value: true,
            message: 'Recipient account number is required'
        },
        pattern: {
            value: /^\d{26}$/,
            message: 'Invalid account number'
        }
    },
    transferTitle: {
        required: {
            value: true,
            message: 'Title is required'
        }
    },
    amount: {
        required: {
            value: true,
            message: 'Amount is required'
        },
        pattern: {
            value: /^\d{1,}([.]?\d{0,2})?$/,
            message: 'Invalid amount format'
        }
    },
    loanAmount: {
        required: {
            value: true,
            message: 'Amount is required'
        },
        min: {
            value: 1000,
            message: 'Minimum value is 1000'
        },
        max: {
            value: 100000,
            message: 'Minimum value is 100000'
        },
        pattern: {
            value: /^([1-9]\d{0,1}0{3}|[1-9]\d{0,1}0{4})$/,
            message: 'Invalid amount format. Provide amount in thousands'
        }
    },
    cyclicPaymentName: {
        required: {
            value: true,
            message: 'Cyclic Payment name is required'
        }
    },
    interval: {
        required: {
            value: true,
            message: 'Interval is required'
        }
    },
    userFields: {
        login: {
            required: 'Należy podać nową nazwę użytkownika',
        },
        accountName: {
            required: 'Należy podać nową nazwę konta',
        },
        currency: {
            required: 'Należy podać nową walutę',
            pattern: {
                value: /^[A-Z]{3}$/,
                message: 'Kod waluty musi składać się z trzech dużych liter (np. USD, EUR)',
            }
        }
    }
};