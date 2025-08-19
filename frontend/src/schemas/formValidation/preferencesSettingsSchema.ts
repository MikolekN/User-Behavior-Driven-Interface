import { z } from 'zod';

export const PreferencesSettingsFormDataSchema = z.object({
    areEventsCollected: z.boolean(),
    isNextStepVisible: z.boolean(),
    isShortcutVisible: z.boolean(),
    isQuickIconsVisible: z.boolean(),
    isMenuPriorityVisible: z.boolean()
});

export type PreferencesSettingsFormData = z.infer<typeof PreferencesSettingsFormDataSchema>;
