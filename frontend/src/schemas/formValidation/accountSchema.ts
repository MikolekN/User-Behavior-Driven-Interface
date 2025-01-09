import { z } from 'zod';
import { requiredStringField } from '../common/commonValidators';
import { CURRENCY_REGEX } from './constants';

export const AccountFormDataSchema = z.object({
    accountName: requiredStringField(),
    accountType: requiredStringField(),
    currency: requiredStringField().regex(new RegExp(CURRENCY_REGEX), {
        message: 'invalidCurrencyFormat'
    })
});

export type AccountFormData = z.infer<typeof AccountFormDataSchema>;
