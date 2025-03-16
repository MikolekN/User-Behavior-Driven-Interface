import { User } from "../../components/utils/User";
import { validateSchema } from "../../schemas/apiValidation/validator";
import { EVENT_API_URL } from "../../services/constants";
import { handleApiResponse } from "../../services/handleApiResponse";
import { SendClickEventResponse, SendClickEventResponseSchema } from "../schemas/sendClickEventSchema";

export const sendClickEventData = async (user: User, requestBody: object): Promise<SendClickEventResponse> => {
    const response = await fetch(`${EVENT_API_URL}/events/${user.id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': user.token!
        },
        body: JSON.stringify(requestBody),
        credentials: 'include'
    });

    const apiResponse = await handleApiResponse<SendClickEventResponse>(response);
    
    return validateSchema({ dto: apiResponse, schema: SendClickEventResponseSchema, schemaName: 'create/account' });
};
