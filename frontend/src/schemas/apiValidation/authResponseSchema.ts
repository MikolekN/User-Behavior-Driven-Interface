import { z } from 'zod';
import { requiredStringField } from '../common/commonValidators';

// Login

export const UserData = z.object({
    login: requiredStringField('login'),
    email: requiredStringField('email').email(),
    account_name: requiredStringField('account_name'),
    account_number: requiredStringField('account_number'),
    blockades: z.number(),
    balance: z.number(),
    currency: requiredStringField('currency'),
    role: requiredStringField('role'),
    icon: z.custom<File>().nullable().optional()
});

export const LoginResponseSchema = z.object({
    message: requiredStringField('message'),
    user: UserData
});

export type LoginResponse = z.infer<typeof LoginResponseSchema>;

// Register

export const RegisterResponseSchema = z.object({
    message: requiredStringField('message')
});

export type RegisterResponse = z.infer<typeof RegisterResponseSchema>;

// Logout

export const LogoutResponseSchema = z.object({
    message: requiredStringField('message')
});

export type LogoutResponse = z.infer<typeof LogoutResponseSchema>;