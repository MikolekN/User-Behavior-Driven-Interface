import { z, ZodError } from 'zod';

export const requiredStringField = 
    (fieldName: string = 'Field') => 
        z.string().min(1, { message: `${fieldName} is required` });

export function isZodError(err: unknown): err is ZodError {
  return Boolean(
    err && (err instanceof ZodError || (err as ZodError).name === 'ZodError'),
  );
}
