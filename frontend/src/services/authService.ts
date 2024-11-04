
// zastanowic się czy warto mieć też swoje interfejsy, albo jeśli nie to gdzie miec funkcje mapujące wersje backend na frontend
import { IBackendUser } from '../components/utils/User';

import { LoginResponse, LoginResponseSchema, LogoutResponseSchema, RegisterResponse, RegisterResponseSchema } from '../schemas/apiValidation/authResponseSchema';
import { validateSchema } from '../schemas/apiValidation/validator';
import { API_URL } from './constants';
import { handleApiResponse } from './handleApiResponse';

export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
    });
    const apiResponse = await handleApiResponse<LoginResponse>(response);

    return validateSchema({ dto: apiResponse, schema: LoginResponseSchema, schemaName: '/login' });
};

// interface RegisterResponse {
//     message: string;
// }

export const registerUser = async (email: string, password: string): Promise<RegisterResponse> => {
    const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });
    const apiResponse = await handleApiResponse<RegisterResponse>(response);

    return validateSchema({ dto: apiResponse, schema: RegisterResponseSchema, schemaName: '/register' });
};

export const logoutUser = async (): Promise<void> => {
    const response = await fetch(`${API_URL}/logout`, {
        method: 'POST',
        credentials: 'include',
    });
    const apiResponse = await handleApiResponse(response);

    validateSchema({ dto: apiResponse, schema: LogoutResponseSchema, schemaName: '/logout' })
};
