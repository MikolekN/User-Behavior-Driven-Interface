import { z } from 'zod';
import { requiredStringField } from '../common/commonValidators';
import { ACCOUNT_NUMBER_REGEX, AMOUNT_REGEX, ZERO } from './constants';

export const CyclicPaymentFormDataSchema = z.object({
    cyclicPaymentName: requiredStringField(),
    recipientAccountNumber: requiredStringField().regex(new RegExp(ACCOUNT_NUMBER_REGEX), {
        message: 'accountNumber'
    }),
    transferTitle: requiredStringField(),
    amount: requiredStringField(),
    startDate: z.date({ message: 'required' }),
    interval: requiredStringField()
    })
    .superRefine((data, ctx) => {

        if (parseFloat(data.amount) <= ZERO) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'amountGreaterThanZero',
                path: ['amount']
            });
        }

        if (!AMOUNT_REGEX.test(data.amount)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'invalidAmountFormat',
                path: ['amount']
            });
        }
    }
);

export type CyclicPaymentFormData = z.infer<typeof CyclicPaymentFormDataSchema>;
