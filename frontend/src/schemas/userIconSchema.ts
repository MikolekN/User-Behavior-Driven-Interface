import { z } from "zod";
import { ACCEPTED_IMAGE_TYPES, ACCEPTED_IMAGE_TYPES_ERR_MSG, BYTES_IN_KILOBYTE, KILOBYTES_IN_MEGABYTE, MAX_IMAGE_SIZE, NUMBER_OF_DECIMALS } from "./constants";

const sizeInMB = (sizeInBytes: number) => {
    const result = sizeInBytes / (BYTES_IN_KILOBYTE * KILOBYTES_IN_MEGABYTE);
    return parseFloat(result.toFixed(NUMBER_OF_DECIMALS));
};

export const UserIconFormDataSchema = z.object({
    files:  z.custom<FileList>()
        .refine((files) => {
            return Array.from(files ?? []).length !== 0;
        }, {
            message: 'File is required',
        })
        .refine((files) => {
            return Array.from(files ?? []).every(
                (file) => sizeInMB(file.size) <= MAX_IMAGE_SIZE
            );
        }, {
            message: `The maximum file size is: ${MAX_IMAGE_SIZE} MB`,
        })
        .refine((files) => {
            return Array.from(files ?? []).every((file) =>
                ACCEPTED_IMAGE_TYPES.includes(file.type)
            );
        }, {
            message: `Unsupported file type. Please provide file with type: ${ACCEPTED_IMAGE_TYPES_ERR_MSG.join(' or ')}`,
        })
    }
);

export type UserIconFromData = z.infer<typeof UserIconFormDataSchema>;
