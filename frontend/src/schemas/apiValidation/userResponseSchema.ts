import { z } from 'zod';
import { requiredStringField } from '../common/commonValidators';

// GetLogin

export const UserData = z.object({
    _id: requiredStringField(),
    login: requiredStringField(),
    email: requiredStringField().email(),
    active_account: z.string().nullable(),
    created: requiredStringField(),
    is_deleted: z.boolean(),
    role: requiredStringField()
});

export const GetUserResponseSchema = z.object({
    message: requiredStringField(),
    user: UserData
});

export type GetUserResponse = z.infer<typeof GetUserResponseSchema>;

// Update User

export const UpdateUserResponseSchema = z.object({
    message: requiredStringField(),
    user: UserData
});

export type UpdateUserResponse = z.infer<typeof UpdateUserResponseSchema>;

// Update User Password

export const UpdateUserPasswordResponseSchema = z.object({
    message: requiredStringField(),
    user: UserData
});

export type UpdateUserPasswordResponse = z.infer<typeof UpdateUserPasswordResponseSchema>;