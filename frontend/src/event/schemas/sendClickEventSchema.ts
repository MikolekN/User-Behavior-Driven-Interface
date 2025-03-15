import { z } from "zod";
import { requiredStringField } from "../../schemas/common/commonValidators";

export const SendClickEventResponseSchema = z.object({
    message: requiredStringField()
});

export type SendClickEventResponse = z.infer<typeof SendClickEventResponseSchema>;
