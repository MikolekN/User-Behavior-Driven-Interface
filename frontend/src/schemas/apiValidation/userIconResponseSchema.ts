import { z } from 'zod';
import { requiredStringField } from '../common/commonValidators';

// uploadUserIcon

export const UploadUserIconResponseSchema = z.object({
    message: requiredStringField('message')
});

export type UploadUserIconResponse = z.infer<typeof UploadUserIconResponseSchema>;
