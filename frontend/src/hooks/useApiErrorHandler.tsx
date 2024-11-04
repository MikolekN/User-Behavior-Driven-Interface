import { useState, useEffect } from 'react';
import { isZodError } from '../schemas/common/commonValidators';

function useApiErrorHandler() {
    const [errorMessage, setErrorMessage] = useState('');
    const [apiError, setApiError] = useState({ isError: false, errorMessage: '' });

    const handleError = (error: unknown) => {
        if (isZodError(error)) {
            setErrorMessage('Zod API validation error');
        } else {
            setErrorMessage((error as Error).message || 'An unknown error occurred. Please try again.');
        }
    };

    useEffect(() => {
        if (errorMessage) {
            setApiError({
                isError: true,
                errorMessage
            });
        }
    }, [errorMessage]);

    return { apiError, handleError };
}

export default useApiErrorHandler;
