import { z } from 'zod';
import { requiredStringField } from '../common/commonValidators';

// createCyclicPayment

export const CyclicPaymentDataSchema = z.object({
    _id: requiredStringField('id'),
    amount: z.number(),
    cyclic_payment_name: requiredStringField('cyclic_payment_name'),
    interval: requiredStringField('interval'),
    recipient_account_number: requiredStringField('recipient_account_number'),
    recipient_name: requiredStringField('recipient_name'),
    start_date: requiredStringField('start_date'),
    transfer_title: requiredStringField('transfer_title')
});

export const CreateCyclicPaymentResponseSchema = z.object({
    message: requiredStringField('message'),
    cyclic_payment: CyclicPaymentDataSchema
});

export type CreateCyclicPaymentResponse = z.infer<typeof CreateCyclicPaymentResponseSchema>;

// get cyclic payment

export const GetCyclicPaymentResponseSchema = z.object({
    message: requiredStringField('message'),
    cyclic_payment: CyclicPaymentDataSchema
});

export type GetCyclicPaymentResponse = z.infer<typeof GetCyclicPaymentResponseSchema>;

// update cyclic payment

export const UpdateCyclicPaymentResponseSchema = z.object({
    message: requiredStringField('message'),
    cyclic_payment: CyclicPaymentDataSchema
});

export type UpdateCyclicPaymentResponse = z.infer<typeof UpdateCyclicPaymentResponseSchema>;

// delete cyclic payment

export const DeleteCyclicPaymentResponseSchema = z.object({
    message: requiredStringField('message')
});

export type DeleteCyclicPaymentResponse = z.infer<typeof DeleteCyclicPaymentResponseSchema>;

// get cyclic payment's list

export const GetCyclicPaymentsListResponseSchema = z.object({
    message: requiredStringField('message'),
    cyclic_payments: z.array(CyclicPaymentDataSchema)
});

export type GetCyclicPaymentsListResponse = z.infer<typeof GetCyclicPaymentsListResponseSchema>;
