export interface ErrorResponse {
    message: string;
}

export const isErrorResponse = (data: unknown): data is ErrorResponse => {
    return (
        typeof data === 'object' &&
        data !== null &&
        'message' in data &&
        typeof (data as ErrorResponse).message === 'string'
    );
};
