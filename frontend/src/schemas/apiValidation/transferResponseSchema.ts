import { z } from 'zod';
import { requiredStringField } from '../common/commonValidators';

// GetTransfersAnalysis

export const ChartDataSchema = z.object({
    income: z.number(),
    outcome: z.number(),
    interval: requiredStringField()
});

export const GetTransfersAnalysisResponseSchema = z.object({
    message: requiredStringField(),
    transfers: z.array(ChartDataSchema)
});

export type GetTransfersAnalysisResponse = z.infer<typeof GetTransfersAnalysisResponseSchema>;

//

export const TransactionData = z.object({
    _id: requiredStringField(),
    amount: z.number(),
    created: requiredStringField(),
    is_deleted: z.boolean(),
    is_income: z.boolean(),
    title: requiredStringField(),
    issuer_name: requiredStringField(),
    recipient_account_number: requiredStringField(),
    sender_account_number: requiredStringField()
});

export const TransactionsHistoryData = z.object({
    date: z.string(),
    transactions: z.array(TransactionData)
});

// GetTransfers

export const GetTransfersResponseSchema = z.object({
    message: requiredStringField(),
    transactions: z.array(TransactionsHistoryData)
});

export type GetTransfersResponse = z.infer<typeof GetTransfersResponseSchema>;


// CreateTransfer

export const CreateTransferResponseSchema = z.object({
    message: requiredStringField()
});

export type CreateTransfersResponse = z.infer<typeof CreateTransferResponseSchema>;

// CreateLoan

export const CreateLoanResponseSchema = z.object({
    message: requiredStringField()
});

export type CreateLoanResponse = z.infer<typeof CreateLoanResponseSchema>;


