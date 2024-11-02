import { isErrorResponse } from '../schemas/apiValidation/ErrorResponse';
import { API_URL } from './constants';
import { handleApiResponse } from './handleApiResponse';

export const getUserIcon = async (): Promise<Blob> => {
    const response = await fetch(`${API_URL}/user/icon`, {
        method: 'GET',
        credentials: 'include',
    });

    if (!response.ok) {
        let data: unknown;
        try {
            data = await response.json();
        } catch {
            console.error('Failed to parse response as JSON');
            throw new Error('Fetching icon failed: Invalid JSON response');
        }

        if (isErrorResponse(data)) {
            console.error(`Failed to fetch icon: ${data.message}`, response.status);
            throw new Error(data.message || 'Fetching icon failed');
        } else {
            console.error('Failed to fetch icon: Unknown response format', response.status);
            throw new Error('Fetching icon failed with an unknown response format.');
        }
    }

    return response.blob();
};

export const uploadUserIcon = async (icon: File): Promise<void> => {
    const formData = new FormData();
    formData.append('icon', icon);
    const response = await fetch(`${API_URL}/user/icon`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
    });
    await handleApiResponse(response);
};
