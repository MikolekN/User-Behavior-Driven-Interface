import { z } from 'zod';
import { requiredStringField } from './commonValidators';
import { MIN_PASSWORD_LENGTH, PASSWORD_REGEX } from './constants';

export const RegisterFormDataSchema = z.object({
    email: requiredStringField('Email').email(),
    password: requiredStringField('Password').min(MIN_PASSWORD_LENGTH).regex(new RegExp(PASSWORD_REGEX), {
        message:
            `Password must be at least ${MIN_PASSWORD_LENGTH} characters and contain an uppercase letter, lowercase letter, and number`
    }),
    confirmPassword: requiredStringField('Confirm Password')
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

export type RegisterFormData = z.infer<typeof RegisterFormDataSchema>;
