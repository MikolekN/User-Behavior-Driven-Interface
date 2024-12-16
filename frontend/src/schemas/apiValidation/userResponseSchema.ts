import { z } from 'zod';
import { requiredStringField } from '../common/commonValidators';

// GetLogin

export const UserData = z.object({
    login: requiredStringField(),
    email: requiredStringField().email(),
    account_name: requiredStringField(),
    account_number: requiredStringField(),
    blockades: z.number(),
    balance: z.number(),
    currency: requiredStringField(),
    role: requiredStringField(),
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
    message: requiredStringField()
});

export type UpdateUserPasswordResponse = z.infer<typeof UpdateUserPasswordResponseSchema>;