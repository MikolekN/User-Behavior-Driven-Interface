import { validateSchema } from "../../schemas/apiValidation/validator";
import { EVENT_API_URL } from "../../services/constants";
import { handleApiResponse } from "../../services/handleApiResponse";
import { SendClickEventResponse, SendClickEventResponseSchema } from "../schemas/SendClickEventSchema";

export const sendClickEventData = async (requestBody: object): Promise<SendClickEventResponse> => {
    const response = await fetch(`${EVENT_API_URL}/clickEvent`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody),
        credentials: 'include'
    });

    const apiResponse = await handleApiResponse<SendClickEventResponse>(response);
    
    return validateSchema({ dto: apiResponse, schema: SendClickEventResponseSchema, schemaName: 'create/account' });
};
