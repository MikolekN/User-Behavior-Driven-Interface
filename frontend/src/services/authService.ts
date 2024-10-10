import { ErrorResponse, isErrorResponse } from '../components/utils/types/ErrorResponse';
import { IBackendUser } from '../components/utils/User';

export const API_URL = 'http://127.0.0.1:5000/api';

interface GetUserResponse {
    user: IBackendUser;
}

interface LoginResponse {
    user: IBackendUser;
}

interface RegisterResponse {
    message: string;
}

interface UpdateUserResponse {
    user: IBackendUser;
}

const handleApiResponse = async <T>(response: Response): Promise<T> => {
    const data = await response.json() as T | ErrorResponse;
    if (!response.ok) {
        if (isErrorResponse(data)) {
            const message = data.message || 'Something went wrong with the API request.';
            console.error(`Error: ${response.status} - ${response.statusText}`, message);
            throw new Error(message);
        } else {
            throw new Error('Unexpected response.');
        }
    }
    return data as T;
};

export const getUserData = async (): Promise<GetUserResponse> => {
    const response = await fetch(`${API_URL}/user`, {
        method: 'GET',
        credentials: 'include',
    });
    return handleApiResponse<GetUserResponse>(response);
};

export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
    });
    return handleApiResponse<LoginResponse>(response);
};

export const registerUser = async (email: string, password: string): Promise<RegisterResponse> => {
    const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });
    return handleApiResponse<RegisterResponse>(response);
};

export const logoutUser = async (): Promise<void> => {
    const response = await fetch(`${API_URL}/logout`, {
        method: 'POST',
        credentials: 'include',
    });
    await handleApiResponse(response);
};

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

export const updateUserField = async (field: string, value: string): Promise<UpdateUserResponse> => {
    const response = await fetch(`${API_URL}/user/update`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value }),
    });
    return handleApiResponse<UpdateUserResponse>(response);
};

export const updateUserPassword = async (currentPassword: string, newPassword: string): Promise<void> => {
    const response = await fetch(`${API_URL}/user/password`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            current_password: currentPassword,
            new_password: newPassword,
        }),
    });
    await handleApiResponse(response);
};
