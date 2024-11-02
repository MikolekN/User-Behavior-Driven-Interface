import { z } from 'zod';
import { requiredStringField } from '../common/commonValidators';

export const ChartDataSchema = z.object({
    income: z.number(),
    outcome: z.number(),
    interval: requiredStringField("interval")
});

export const GetTransfersAnalysisResponseSchema = z.object({
    message: requiredStringField("message"),
    chartData: z.array(ChartDataSchema)
});

export type GetTransfersAnalysisResponse = z.infer<typeof GetTransfersAnalysisResponseSchema>;
