import { z } from "zod";
import { requiredStringField } from "../common/commonValidators";

export const CardFormDataSchema = z.object({
    name: requiredStringField(),
    holderName: requiredStringField()
});

export type CardFormData = z.infer<typeof CardFormDataSchema>;