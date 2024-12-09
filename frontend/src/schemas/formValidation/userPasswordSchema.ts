import { z } from 'zod';
import { requiredStringField } from '../common/commonValidators';
import { MIN_PASSWORD_LENGTH, PASSWORD_REGEX } from './constants';

export const UserPasswordFormDataSchema = z.object({
    currentPassword: requiredStringField(),
    newPassword: requiredStringField().min(MIN_PASSWORD_LENGTH).regex(new RegExp(PASSWORD_REGEX), {
        message:
            `Password must be at least ${MIN_PASSWORD_LENGTH} characters and contain an uppercase letter, lowercase letter, and number`
    })
});

export type UserPasswordFormData = z.infer<typeof UserPasswordFormDataSchema>;
