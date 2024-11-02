import { z } from 'zod';
import { requiredStringField } from './commonValidators';
import { ACCOUNT_NUMBER_REGEX, AMOUNT_REGEX, ZERO } from './constants';

export const CyclicPaymentFormDataSchema = z.object({
    cyclicPaymentName: requiredStringField('Cyclic Payment Name'),
    recipientAccountNumber: requiredStringField('Recipient Account Number').regex(new RegExp(ACCOUNT_NUMBER_REGEX), {
        message: 'Invalid account number'
    }),
    transferTitle: requiredStringField('Transfer Title'),
    amount: requiredStringField('Amount'),
    startDate: z.date().nullable(),
    interval: requiredStringField('Interval')
    })
    .superRefine((data, ctx) => {

        if (parseFloat(data.amount) <= ZERO) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Amount should be greater than 0',
                path: ['amount']
            });
        }

        if (!AMOUNT_REGEX.test(data.amount)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Invalid Amount format. Two decimal places are allowed',
                path: ['amount']
            });
        }
    }
);

export type CyclicPaymentFormData = z.infer<typeof CyclicPaymentFormDataSchema>;
