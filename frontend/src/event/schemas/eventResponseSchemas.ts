import { z } from "zod";
import { requiredStringField } from "../../schemas/common/commonValidators";

const PreferenceSchema = z.object({
    _id: requiredStringField(),
    created: requiredStringField(),
    is_deleted: z.boolean(),
    user_id: requiredStringField(),
    preferences: z.object({
        quickIconsPreference: requiredStringField()
    })
});

export const SendClickEventResponseSchema = z.object({
    message: requiredStringField()
});

export type SendClickEventResponse = z.infer<typeof SendClickEventResponseSchema>;

export const SendPageTransitionEventResponseSchema = z.object({
    message: requiredStringField()
});

export type SendPageTransitionEventResponse = z.infer<typeof SendPageTransitionEventResponseSchema>;

export const UserPreferencesResponseSchema = z.object({
    message: requiredStringField(),
    preferences: PreferenceSchema
});

export type GetUserPreferencesResponse = z.infer<typeof UserPreferencesResponseSchema>;
export type GenerateUserPreferencesResponse = z.infer<typeof UserPreferencesResponseSchema>;
