import { GetUserResponse, GetUserResponseSchema, UpdateUserPasswordResponseSchema, UpdateUserResponse, UpdateUserResponseSchema } from '../schemas/apiValidation/userResponseSchema';
import { API_URL } from './constants';
import { handleApiResponse } from './handleApiResponse';
import { validateSchema } from '../schemas/apiValidation/validator';

export const getUserData = async (): Promise<GetUserResponse> => {
    const response = await fetch(`${API_URL}/user`, {
        method: 'GET',
        credentials: 'include',
    });
    const apiResponse = await handleApiResponse<GetUserResponse>(response);

    return validateSchema({ dto: apiResponse, schema: GetUserResponseSchema, schemaName: '/user' });
};

export const updateUserField = async (field: string, value: string): Promise<UpdateUserResponse> => {
    const response = await fetch(`${API_URL}/user/update`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value }),
    });
    const apiResponse = await handleApiResponse<UpdateUserResponse>(response);

    return validateSchema({ dto: apiResponse, schema: UpdateUserResponseSchema, schemaName: '/user' });
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
    const apiResponse = await handleApiResponse(response);

    validateSchema({ dto: apiResponse, schema: UpdateUserPasswordResponseSchema, schemaName: '/user' });
};
