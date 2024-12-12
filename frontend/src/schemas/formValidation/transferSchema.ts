import { z } from 'zod';
import { requiredStringField } from '../common/commonValidators';
import { ACCOUNT_NUMBER_REGEX, AMOUNT_REGEX, ZERO } from './constants';

export const TransferFormDataSchema = z.object({
    recipientAccountNumber: requiredStringField().regex(new RegExp(ACCOUNT_NUMBER_REGEX), {
        message: 'invalidAccountNumber'
    }),
    transferTitle: requiredStringField(),
    amount: requiredStringField()
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

export type TransferFormData = z.infer<typeof TransferFormDataSchema>;
