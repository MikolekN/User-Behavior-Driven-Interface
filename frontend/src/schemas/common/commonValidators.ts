import { z } from 'zod';


export const requiredStringField = (fieldName: string = 'Field') => { 
    z.string().min(1, { message: `${fieldName} is required` });
};
