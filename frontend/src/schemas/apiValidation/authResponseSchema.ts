import { z } from 'zod';
import { requiredStringField } from '../common/commonValidators';

// Login

export const LoginResponseSchema = z.object({
    message: requiredStringField()
});

export type LoginResponse = z.infer<typeof LoginResponseSchema>;

// Register

export const RegisterResponseSchema = z.object({
    message: requiredStringField()
});

export type RegisterResponse = z.infer<typeof RegisterResponseSchema>;

// Logout

export const LogoutResponseSchema = z.object({
    message: requiredStringField()
});

export type LogoutResponse = z.infer<typeof LogoutResponseSchema>;