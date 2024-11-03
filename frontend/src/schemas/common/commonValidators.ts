import { z, ZodError } from 'zod';

export const requiredStringField = 
    (fieldName: string = 'Field') => 
        z.string().min(1, { message: `${fieldName} is required` });

export function isZodError(error: unknown): error is ZodError {
    return Boolean(
        error && (error instanceof ZodError || (error as ZodError).name === 'ZodError'),
    );
}
