export const MIN_PASSWORD_LENGTH: number = 8;
export const REQUIRED_TEXT_INPUT_LENGTH: number = 1;
export const ZERO: number = 0;
export const MIN_LOAN_VALUE: number = 1000
export const MAX_LOAN_VALUE: number = 100000

export const ACCEPTED_IMAGE_TYPES: string[] = ['image/png', 'image/jpg', 'image/jpeg'];
export const ACCEPTED_IMAGE_TYPES_ERR_MSG: string[] = ['*.png', '*.jpg', '*.jpeg'];
export const MAX_IMAGE_SIZE: number = 8; //In MegaBytes
export const NUMBER_OF_DECIMALS: number = 2;
export const BYTES_IN_KILOBYTE: number = 1024;
export const KILOBYTES_IN_MEGABYTE: number = 1024;



export const PASSWORD_REGEX: RegExp = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
export const AMOUNT_REGEX: RegExp = /^\d+(\.\d{1,2})?$/;
export const ACCOUNT_NUMBER_REGEX: RegExp = /^\d{26}$/;
export const LOAN_AMOUNT_REGEX: RegExp = /^([1-9]\d{0,1}0{3}|[1-9]\d{0,1}0{4})$/;
export const CURRENCY_REGEX: RegExp = /^[A-Z]{3}$/;
