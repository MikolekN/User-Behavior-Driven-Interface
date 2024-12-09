import { ErrorResponse, isErrorResponse } from '../schemas/apiValidation/ErrorResponse';

export const handleApiResponse = async <T>(response: Response): Promise<T> => {
    const data = await response.json() as T | ErrorResponse;
    if (!response.ok) {
        if (isErrorResponse(data)) {
            const message = data.message || 'sthWentWrong';
            console.error(`Error: ${response.status} - ${response.statusText}`, message);
            throw new Error(message);
        } else {
            console.error(`Error: ${response.status} - ${response.statusText}`, 'Unexpected response.');
            throw new Error('unexpectedResponse');
        }
    }
    return data as T;
};