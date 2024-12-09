import { z, ZodError } from 'zod';

export const requiredStringField = 
    () => z.string().trim().min(1, { message: 'required' });

export function isZodError(error: unknown): error is ZodError {
    return Boolean(
        error && (error instanceof ZodError || (error as ZodError).name === 'ZodError'),
    );
}
