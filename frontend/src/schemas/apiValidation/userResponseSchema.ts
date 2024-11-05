import { z } from 'zod';
import { requiredStringField } from '../common/commonValidators';

// GetLogin

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

export const GetUserResponseSchema = z.object({
    user: UserData
});

export type GetUserResponse = z.infer<typeof GetUserResponseSchema>;

// Update User

export const UpdateUserResponseSchema = z.object({
    user: UserData
});

export type UpdateUserResponse = z.infer<typeof UpdateUserResponseSchema>;

// Update User Password

export const UpdateUserPasswordResponseSchema = z.object({
    message: requiredStringField('message')
});

export type UpdateUserPasswordResponse = z.infer<typeof UpdateUserPasswordResponseSchema>;