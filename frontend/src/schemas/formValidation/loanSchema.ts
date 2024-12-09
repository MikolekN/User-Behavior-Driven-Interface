import { z } from 'zod';
import { requiredStringField } from '../common/commonValidators';
import { LOAN_AMOUNT_REGEX } from './constants';
import { MAX_LOAN_AMOUNT, MIN_LOAN_AMOUNT } from '../../pages/constants';

export const LoanFormDataSchema = z.object({
    amount: requiredStringField() 
    })
    .superRefine((data, ctx) => {

        if (parseFloat(data.amount) < MIN_LOAN_AMOUNT) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `amountLowerThan;${MIN_LOAN_AMOUNT}`,
                path: ['amount']
            });
        }

        if (parseFloat(data.amount) > MAX_LOAN_AMOUNT) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `amountBiggerThan;${MAX_LOAN_AMOUNT}`,
                path: ['amount']
            });
        }

        if (!LOAN_AMOUNT_REGEX.test(data.amount)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'loanInvalidAmountFormat',
                path: ['amount']
            });
        }
    }
);

export type LoanFormData = z.infer<typeof LoanFormDataSchema>;
