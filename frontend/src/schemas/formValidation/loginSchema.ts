import { z } from 'zod';
import { requiredStringField } from '../common/commonValidators';

export const LoginFormDataSchema = z.object({
    email: requiredStringField('Email').email(),
    password: requiredStringField('Password')
});

export type LoginFormData = z.infer<typeof LoginFormDataSchema>;
