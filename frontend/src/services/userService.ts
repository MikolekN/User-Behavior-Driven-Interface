import { IBackendUser } from '../components/utils/User';
import { API_URL } from './constants';
import { handleApiResponse } from './handleApiResponse';

interface GetUserResponse {
    user: IBackendUser;
}

export const getUserData = async (): Promise<GetUserResponse> => {
    const response = await fetch(`${API_URL}/user`, {
        method: 'GET',
        credentials: 'include',
    });
    return handleApiResponse<GetUserResponse>(response);
};

interface UpdateUserResponse {
    user: IBackendUser;
}

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
