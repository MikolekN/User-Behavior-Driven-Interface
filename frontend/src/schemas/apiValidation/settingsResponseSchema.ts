import { z } from "zod";
import { requiredStringField } from "../common/commonValidators";


const SettingsSchema = z.object({
    _id: requiredStringField(),
    created: requiredStringField(),
    is_deleted: z.boolean(),
    user_id: requiredStringField(),
    settings: z.object({
        appSettings: z.object({}),
        preferencesSettings: z.object({
            areEventsCollected: z.boolean(),
            isNextStepVisible: z.boolean(),
            isShortcutVisible: z.boolean(),
            isQuickIconsVisible: z.boolean(),
            isMenuPriorityVisible: z.boolean()
        })
    })
});

export const GetUserSettingsResponseSchema = z.object({
    message: requiredStringField(),
    settings: SettingsSchema
});

export type GetUserSettingsResponse = z.infer<typeof GetUserSettingsResponseSchema>;

export const UpdateUserSettingsResponseSchema = z.object({
    message: requiredStringField(),
    settings: SettingsSchema
});

export type UpdateUserSettingsResponse = z.infer<typeof UpdateUserSettingsResponseSchema>;
