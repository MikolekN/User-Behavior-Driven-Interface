import { z } from 'zod';
import { requiredStringField } from '../common/commonValidators';

export const LoginFormDataSchema = z.object({
    email: requiredStringField().email(),
    password: requiredStringField()
});

export type LoginFormData = z.infer<typeof LoginFormDataSchema>;
