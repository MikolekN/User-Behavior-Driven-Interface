import { useState, useEffect } from 'react';
import { isZodError } from '../schemas/common/commonValidators';
import { useTranslation } from 'react-i18next';

function useApiErrorHandler() {
    const { t } = useTranslation();
    const [errorMessage, setErrorMessage] = useState('');
    const [apiError, setApiError] = useState({ isError: false, errorMessage: '' });

    const clearApiError = () => {
        setApiError({
            isError: false,
            errorMessage: ''
        });
        setErrorMessage('');
    };

    const handleError = (error: unknown) => {
        if (isZodError(error)) {
            setErrorMessage(`${t('errors.zod.zodApiError')}`);
        } else if (error instanceof Error && error.message.includes("NetworkError")) {
            setErrorMessage(`${t('errors.api.networkError')}`);
        } else {
            const [errorKey, params = ""] = (error as Error).message.split(";");
            setErrorMessage(`${t(`errors.api.${errorKey}`)} ${params}` || `${t('errors.api.unknownError')}`);
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

    return { apiError, handleError, clearApiError };
}

export default useApiErrorHandler;
