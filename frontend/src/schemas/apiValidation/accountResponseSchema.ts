import { z } from 'zod';
import { requiredStringField } from '../common/commonValidators';

// createAccount

export const AccountDataSchema = z.object({
    _id: requiredStringField(),
    account_name: requiredStringField(),
    account_number: requiredStringField(),
    blockades: z.number(),
    balance: z.number(),
    currency: requiredStringField(),
    account_type: requiredStringField(),
});

export const CreateAccountResponseSchema = z.object({
    message: requiredStringField(),
    account: AccountDataSchema
});

export type CreateAccountResponse = z.infer<typeof CreateAccountResponseSchema>;

// get Account

export const GetAccountResponseSchema = z.object({
    message: requiredStringField(),
    account: AccountDataSchema
});

export type GetAccountResponse = z.infer<typeof GetAccountResponseSchema>;

// get active Account

export const GetActiveAccountResponseSchema = z.object({
    message: requiredStringField(),
    account: AccountDataSchema
});

export type GetActiveAccountResponse = z.infer<typeof GetActiveAccountResponseSchema>;

// set active Account

export const SetActiveAccountResponseSchema = z.object({
    message: requiredStringField(),
    account: AccountDataSchema
});

export type SetActiveAccountResponse = z.infer<typeof GetActiveAccountResponseSchema>;

// update Account

export const UpdateAccountResponseSchema = z.object({
    message: requiredStringField(),
    account: AccountDataSchema
});

export type UpdateAccountResponse = z.infer<typeof UpdateAccountResponseSchema>;

// delete Account

export const DeleteAccountResponseSchema = z.object({
    message: requiredStringField()
});

export type DeleteAccountResponse = z.infer<typeof DeleteAccountResponseSchema>;

// get Account's list

export const GetAccountsListResponseSchema = z.object({
    message: requiredStringField(),
    accounts: z.array(AccountDataSchema)
});

export type GetAccountsListResponse = z.infer<typeof GetAccountsListResponseSchema>;