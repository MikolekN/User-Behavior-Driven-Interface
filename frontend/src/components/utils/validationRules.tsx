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
    recipentAccountNumber: {
        required: {
            value: true,
            message: 'Recipent account number is required'
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
    }
  };