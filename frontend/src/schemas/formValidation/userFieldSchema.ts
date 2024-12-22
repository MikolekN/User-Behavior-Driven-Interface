import { z } from 'zod';
import { CURRENCY_REGEX, REQUIRED_TEXT_INPUT_LENGTH } from './constants';

export const UserFieldFormDataSchema = z.object({
    field: z.string().trim().min(1, { message: 'required' }),
    value: z.string().trim()
}).superRefine((data, ctx) => {
    const selectedField = data.field;
    switch (selectedField) {
        case 'login':
            if (data.value.length < REQUIRED_TEXT_INPUT_LENGTH) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'required',
                    path: ['value']
                });
            }
            break;

        case 'accountName':
            if (data.value.length < REQUIRED_TEXT_INPUT_LENGTH) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'required',
                    path: ['value']
                });
            }
            break;

        case 'currency':
            if (data.value.length < REQUIRED_TEXT_INPUT_LENGTH) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'required',
                    path: ['value']
                });
            }

            if (!CURRENCY_REGEX.test(data.value)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'invalidCurrencyFormat',
                    path: ['value']
                });
            }
            break;

        default:
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'invalidFieldSelected',
                path: ['field']
            });
            break;
    }
});

export type UserFieldFormData = z.infer<typeof UserFieldFormDataSchema>;
