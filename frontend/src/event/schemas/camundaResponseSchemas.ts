import { z } from "zod";
import { requiredStringField } from "../../schemas/common/commonValidators";

export const RunProcessInstanceResponseSchema = z.object({
    message: requiredStringField()
});

export type RunProcessInstanceResponse = z.infer<typeof RunProcessInstanceResponseSchema>;

export const GenerateProcessModelResponseSchema = z.object({
    message: requiredStringField()
});

export type GenerateProcessModelResponse = z.infer<typeof GenerateProcessModelResponseSchema>;

export const GetNextStepResponseSchema = z.object({
    message: requiredStringField(),
    next_step: z.object({
        bpmn_element_id: requiredStringField(),
        message: requiredStringField(),
        page: requiredStringField(),
        next_page: requiredStringField(),
        probability: requiredStringField(),
        visits: z.number()
    })
});

export type GetNextStepResponse = z.infer<typeof GetNextStepResponseSchema>;
