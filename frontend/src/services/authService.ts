import { IBackendUser } from '../components/utils/User';
import { API_URL } from './constants';
import { handleApiResponse } from './handleApiResponse';

interface LoginResponse {
    user: IBackendUser;
}

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

interface RegisterResponse {
    message: string;
}

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
