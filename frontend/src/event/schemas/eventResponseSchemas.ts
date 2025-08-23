import { z } from "zod";
import { requiredStringField } from "../../schemas/common/commonValidators";

const PreferenceSchema = z.object({
    _id: requiredStringField(),
    created: requiredStringField(),
    is_deleted: z.boolean(),
    user_id: requiredStringField(),
    preferences: z.object({
        quickIconsPreference: requiredStringField(),
        shortcutPreference: z.array(requiredStringField()),
        autoRedirectPreference: z.object({
            accountForm: requiredStringField(),
            accountFormEdit: requiredStringField(),
            cardForm: requiredStringField(),
            cardFormEdit: requiredStringField(),
            cyclicPaymentForm: requiredStringField(),
            cyclicPaymentFormEdit: requiredStringField(),
            loanForm: requiredStringField(),
            transferForm: requiredStringField(),
            preferencesSettingsForm: requiredStringField()
        }),
        menuPriorityPreference: z.object({
            pagesToHighlight: z.array(requiredStringField())
        })
    })
});

const NextStepPreferenceSchema = z.object({
    url: requiredStringField()
})

export const SendClickEventResponseSchema = z.object({
    message: requiredStringField()
});

export type SendClickEventResponse = z.infer<typeof SendClickEventResponseSchema>;

export const SendHoverEventResponseSchema = z.object({
    message: requiredStringField()
});

export type SendHoverEventResponse = z.infer<typeof SendHoverEventResponseSchema>;

export const SendPageTransitionEventResponseSchema = z.object({
    message: requiredStringField()
});

export type SendPageTransitionEventResponse = z.infer<typeof SendPageTransitionEventResponseSchema>;

export const GetUserPreferencesResponseSchema = z.object({
    message: requiredStringField(),
    preferences: PreferenceSchema
});

export type GetUserPreferencesResponse = z.infer<typeof GetUserPreferencesResponseSchema>;

export const GenerateUserPreferencesResponseSchema = z.object({
    message: requiredStringField()
});

export type GenerateUserPreferencesResponse = z.infer<typeof GenerateUserPreferencesResponseSchema>;

export const  GetNextStepPreferencesResponseSchema = z.object({
    nextStepPreference: NextStepPreferenceSchema
});

export type GetNextStepPreferencesResponce = z.infer<typeof GetNextStepPreferencesResponseSchema>;
