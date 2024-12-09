import { z } from 'zod';
import { requiredStringField } from '../common/commonValidators';

// uploadUserIcon

export const UploadUserIconResponseSchema = z.object({
    message: requiredStringField()
});

export type UploadUserIconResponse = z.infer<typeof UploadUserIconResponseSchema>;
