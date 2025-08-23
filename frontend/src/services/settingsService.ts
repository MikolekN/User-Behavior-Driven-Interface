import { User } from '../components/utils/User';
import { GetUserSettingsResponse, GetUserSettingsResponseSchema, UpdateUserSettingsResponse, UpdateUserSettingsResponseSchema } from '../schemas/apiValidation/settingsResponseSchema';
import { validateSchema } from '../schemas/apiValidation/validator';
import { API_URL } from './constants';
import { handleApiResponse } from './handleApiResponse';


export const getSettingsData = async (user: User): Promise<GetUserSettingsResponse> => {
    const response = await fetch(`${API_URL}/settings/${user.id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': user.token!
        },
        credentials: 'include'
    });

    const apiResponse = await handleApiResponse<GetUserSettingsResponse>(response);
    
    return validateSchema({ dto: apiResponse, schema: GetUserSettingsResponseSchema, schemaName: 'get/user_settings' });
};

export const updateSettingsData = async (user: User, requestBody: object): Promise<UpdateUserSettingsResponse> => {
    const response = await fetch(`${API_URL}/settings/${user.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': user.token!
        },
        body: JSON.stringify(requestBody),
        credentials: 'include'
    });

    const apiResponse = await handleApiResponse<UpdateUserSettingsResponse>(response);
    
    return validateSchema({ dto: apiResponse, schema: UpdateUserSettingsResponseSchema, schemaName: 'get/user_settings' });
};
