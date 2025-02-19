import { z } from 'zod';
import { requiredStringField } from '../common/commonValidators';

export const CyclicPaymentDataSchema = z.object({
    _id: requiredStringField(),
    amount: z.number(),
    created: requiredStringField(),
    cyclic_payment_name: requiredStringField(),
    interval: requiredStringField(),
    is_deleted: z.boolean(),
    issuer_id: requiredStringField(),
    recipient_account_number: requiredStringField(),
    recipient_id: requiredStringField(),
    recipient_name: requiredStringField(),
    start_date: requiredStringField(),
    transfer_title: requiredStringField()
});

// createCyclicPayment

export const CreateCyclicPaymentResponseSchema = z.object({
    message: requiredStringField()
});

export type CreateCyclicPaymentResponse = z.infer<typeof CreateCyclicPaymentResponseSchema>;

// get cyclic payment

export const GetCyclicPaymentResponseSchema = z.object({
    message: requiredStringField(),
    cyclic_payment: CyclicPaymentDataSchema
});

export type GetCyclicPaymentResponse = z.infer<typeof GetCyclicPaymentResponseSchema>;

// update cyclic payment

export const UpdateCyclicPaymentResponseSchema = z.object({
    message: requiredStringField(),
    cyclic_payment: CyclicPaymentDataSchema
});

export type UpdateCyclicPaymentResponse = z.infer<typeof UpdateCyclicPaymentResponseSchema>;

// delete cyclic payment

export const DeleteCyclicPaymentResponseSchema = z.object({
    message: requiredStringField()
});

export type DeleteCyclicPaymentResponse = z.infer<typeof DeleteCyclicPaymentResponseSchema>;

// get cyclic payment's list

export const GetCyclicPaymentsListResponseSchema = z.object({
    message: requiredStringField(),
    cyclic_payments: z.array(CyclicPaymentDataSchema)
});

export type GetCyclicPaymentsListResponse = z.infer<typeof GetCyclicPaymentsListResponseSchema>;
