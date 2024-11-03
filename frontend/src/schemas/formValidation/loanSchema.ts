import { z } from 'zod';
import { requiredStringField } from '../common/commonValidators';
import { LOAN_AMOUNT_REGEX } from './constants';

export const LoanFormDataSchema = z.object({
    amount: requiredStringField('Amount') 
    })
    .superRefine((data, ctx) => {

        if (parseFloat(data.amount) < 1000) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Amount should not be lower than 1000',
                path: ['amount']
            });
        }

        if (parseFloat(data.amount) > 100000) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Provided amount should not be bigger than 100 000',
                path: ['amount']
            });
        }

        if (!LOAN_AMOUNT_REGEX.test(data.amount)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Invalid amount format. Provide amount in thousands',
                path: ['amount']
            });
        }
    }
);

export type LoanFormData = z.infer<typeof LoanFormDataSchema>;
