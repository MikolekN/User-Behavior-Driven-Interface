import { z } from "zod";
import { requiredStringField } from "../common/commonValidators";

export const CardDataSchema = z.object({
    _id: requiredStringField(),
    account: requiredStringField(),
    created: requiredStringField(),
    holder_name: requiredStringField(),
    is_deleted: z.boolean(),
    name: requiredStringField(),
    number: requiredStringField(),
    valid_thru: requiredStringField()
});

// create Card

export const CreateCardResponseSchema = z.object({
    message: requiredStringField()
});

export type CreateCardResponse = z.infer<typeof CreateCardResponseSchema>;

// get Card

export const GetCardResponseSchema = z.object({
    card: CardDataSchema,
    message: requiredStringField()
});

export type GetCardResponse = z.infer<typeof GetCardResponseSchema>;

// get Cars list

export const GetCardsListResponseSchema = z.object({
    cards: z.array(CardDataSchema),
    message: requiredStringField()
});

export type GetCardsListResponse = z.infer<typeof GetCardsListResponseSchema>;

// update Card

export const UpdateCardResponseSchema = z.object({
    card: CardDataSchema,
    message: requiredStringField()
});

export type UpdateCardResponse = z.infer<typeof UpdateCardResponseSchema>;

// delete Card

export const DeleteCardResponseSchema = z.object({
    message: requiredStringField()
});

export type DeleteCardResponse = z.infer<typeof DeleteCardResponseSchema>;
