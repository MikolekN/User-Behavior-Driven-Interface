import { getMenuStructureForGeneratePreferencesRequestBody } from "../../components/Layout/MainMenu/MainMenuData";
import { User } from "../../components/utils/User";
import { validateSchema } from "../../schemas/apiValidation/validator";
import { EVENT_API_URL } from "../../services/constants";
import { handleApiResponse } from "../../services/handleApiResponse";
import { SendClickEventResponse, SendClickEventResponseSchema, GetUserPreferencesResponse, GetUserPreferencesResponseSchema, GenerateUserPreferencesResponseSchema, GenerateUserPreferencesResponse, SendPageTransitionEventResponse, SendPageTransitionEventResponseSchema, SendHoverEventResponse, SendHoverEventResponseSchema, GetNextStepPreferencesResponce, GetNextStepPreferencesResponseSchema } from "../schemas/eventResponseSchemas";

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
    
    return validateSchema({ dto: apiResponse, schema: SendClickEventResponseSchema, schemaName: 'create/click_event' });
};

export const sendHoverEventData = async (user: User, requestBody: object): Promise<SendHoverEventResponse> => {
    const response = await fetch(`${EVENT_API_URL}/events/${user.id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': user.token!
        },
        body: JSON.stringify(requestBody),
        credentials: 'include'
    });

    const apiResponse = await handleApiResponse<SendHoverEventResponse>(response);
    
    return validateSchema({ dto: apiResponse, schema: SendHoverEventResponseSchema, schemaName: 'create/hover_event' });
};

export const sendPageTransitionEventData = async (user: User, requestBody: object): Promise<SendPageTransitionEventResponse> => {
    const response = await fetch(`${EVENT_API_URL}/events/${user.id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': user.token!
        },
        body: JSON.stringify(requestBody),
        credentials: 'include'
    });

    const apiResponse = await handleApiResponse<SendPageTransitionEventResponse>(response);
    
    return validateSchema({ dto: apiResponse, schema: SendPageTransitionEventResponseSchema, schemaName: 'create/page_transition_event' });
};

export const getUserPreferencesData = async (user: User): Promise<GetUserPreferencesResponse> => {
    const response = await fetch(`${EVENT_API_URL}/preferences/${user.id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': user.token!
        },
        credentials: 'include'
    });

    const apiResponse = await handleApiResponse<GetUserPreferencesResponse>(response);
    
    return validateSchema({ dto: apiResponse, schema: GetUserPreferencesResponseSchema, schemaName: 'get/user_preferences' });
};

export const generateUserPreferencesData = async (user: User): Promise<GenerateUserPreferencesResponse> => {
    const response = await fetch(`${EVENT_API_URL}/preferences/generate/${user.id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': user.token!
        },
        body: JSON.stringify(getMenuStructureForGeneratePreferencesRequestBody()),
        credentials: 'include'
    });

    const apiResponse = await handleApiResponse<GenerateUserPreferencesResponse>(response);
    
    return validateSchema({ dto: apiResponse, schema: GenerateUserPreferencesResponseSchema, schemaName: 'generate/user_preferences' });
};

export const getNextStepPreferencesData = async (user: User): Promise<GetNextStepPreferencesResponce> => {
    // const response = await fetch(`${EVENT_API_URL}/next-step-preferences/${user.id}`, {
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': user.token!
    //     },
    //     credentials: 'include'
    // });

    // const apiResponse = await handleApiResponse<GetNextStepPreferencesResponce>(response);
    
    // return validateSchema({ dto: apiResponse, schema: GetNextStepPreferencesResponseSchema, schemaName: 'get/next_step_preference' });

    return {
        nextStepPreference: {
            url: "/faq"
        }
    }
};
