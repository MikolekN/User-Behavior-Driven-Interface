import { z } from 'zod';
import { CURRENCY_REGEX, REQUIRED_TEXT_INPUT_LENGTH } from './constants';

export const UserFieldFormDataSchema = z.object({
    field: z.string().trim().min(1, { message: 'Value is required' }),
    value: z.string().trim()
}).superRefine((data, ctx) => {
    const selectedField = data.field;
    switch (selectedField) {
        case 'login':
            if (data.value.length < REQUIRED_TEXT_INPUT_LENGTH) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Należy podać nową nazwę użytkownika',
                    path: ['value']
                });
            }
            break;

        case 'account_name':
            if (data.value.length < REQUIRED_TEXT_INPUT_LENGTH) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Należy podać nową nazwę konta',
                    path: ['value']
                });
            }
            break;

        case 'currency':
            if (data.value.length < REQUIRED_TEXT_INPUT_LENGTH) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Należy podać nową walutę',
                    path: ['value']
                });
            }

            if (!CURRENCY_REGEX.test(data.value)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Kod waluty musi składać się z trzech wielkich liter',
                    path: ['value']
                });
            }
            break;

        default:
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Invalid field selected',
                path: ['field']
            });
            break;
    }
});

export type UserFieldFormData = z.infer<typeof UserFieldFormDataSchema>;
