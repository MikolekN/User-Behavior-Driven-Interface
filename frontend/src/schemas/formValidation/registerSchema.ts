import { z } from 'zod';
import { requiredStringField } from '../common/commonValidators';
import { MIN_PASSWORD_LENGTH, PASSWORD_REGEX } from './constants';

export const RegisterFormDataSchema = z.object({
    email: requiredStringField().email(),
    password: requiredStringField().min(MIN_PASSWORD_LENGTH).regex(new RegExp(PASSWORD_REGEX), {
        message:
            `password`
    }),
    confirmPassword: requiredStringField()
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'confirmPassword',
        path: ['confirmPassword'],
    });

export type RegisterFormData = z.infer<typeof RegisterFormDataSchema>;
