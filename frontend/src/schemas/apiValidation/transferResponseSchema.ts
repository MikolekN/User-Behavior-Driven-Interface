import { z } from 'zod';
import { requiredStringField } from '../common/commonValidators';

// GetTransfersAnalysis

export const ChartDataSchema = z.object({
    income: z.number(),
    outcome: z.number(),
    interval: requiredStringField('interval')
});

export const GetTransfersAnalysisResponseSchema = z.object({
    message: requiredStringField('message'),
    transfers: z.array(ChartDataSchema)
});

export type GetTransfersAnalysisResponse = z.infer<typeof GetTransfersAnalysisResponseSchema>;


// GetTransfers

export const TransactionData = z.object({
    _id: requiredStringField('id'),
    amount: z.number(),
    created: requiredStringField('created'),
    income: z.boolean(),
    issuer_name: requiredStringField('issuer_name'),
    title: requiredStringField('title'),
    transfer_from_id: requiredStringField('transfer_from_id'),
    transfer_to_id: requiredStringField('transfer_to_id')
});

export const TransactionsHistoryData = z.object({
    date: z.string(),
    transactions: z.array(TransactionData)
});

export const GetTransfersResponseSchema = z.object({
    message: requiredStringField('message'),
    transfers: z.array(TransactionsHistoryData)
});

export type GetTransfersResponse = z.infer<typeof GetTransfersResponseSchema>;


// CreateTransfer

export const CreateTransferResponseSchema = z.object({
    message: requiredStringField('message')
});

export type CreateTransfersResponse = z.infer<typeof CreateTransferResponseSchema>;

// CreateLoan

export const CreateLoanResponseSchema = z.object({
    message: requiredStringField('message')
});

export type CreateLoanResponse = z.infer<typeof CreateLoanResponseSchema>;


