import { CreateCardResponse, CreateCardResponseSchema, DeleteCardResponse, DeleteCardResponseSchema, GetCardResponse, GetCardResponseSchema, GetCardsListResponse, GetCardsListResponseSchema, UpdateCardResponse, UpdateCardResponseSchema } from '../schemas/apiValidation/cardResponseSchema';
import { validateSchema } from "../schemas/apiValidation/validator";
import { API_URL } from "./constants";
import { handleApiResponse } from "./handleApiResponse";


export const createCardData = async (requestBody: object): Promise<CreateCardResponse> => {
    const response = await fetch(`${API_URL}/cards`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody),
        credentials: 'include'
    });

    const apiResponse = await handleApiResponse<CreateCardResponse>(response);

    return validateSchema({ dto: apiResponse, schema: CreateCardResponseSchema, schemaName: '/cards' });
};

export const getCardData = async (cardNumber: string): Promise<GetCardResponse> => {
    const response = await fetch(`${API_URL}/cards/${cardNumber}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    });

    const apiResponse = await handleApiResponse<GetCardResponse>(response);

    return validateSchema({ dto: apiResponse, schema: GetCardResponseSchema, schemaName: 'get/cards/' });
};

export const deleteCardData = async (cardNumber: string): Promise<DeleteCardResponse> => {
    const response = await fetch(`${API_URL}/cards/${cardNumber}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    });

    const apiResponse = await handleApiResponse<DeleteCardResponse>(response);
    
    return validateSchema({ dto: apiResponse, schema: DeleteCardResponseSchema, schemaName: 'delete/cards' });
};

export const updateCardData = async (cardNumber: string, requestBody: object): Promise<UpdateCardResponse> => {
    const response = await fetch(`${API_URL}/cards/${cardNumber}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody),
        credentials: 'include'
    });

    const apiResponse = await handleApiResponse<UpdateCardResponse>(response);
    
    return validateSchema({ dto: apiResponse, schema: UpdateCardResponseSchema, schemaName: 'update/cards' });
};

export const getCardsData = async (): Promise<GetCardsListResponse> => {
    const response = await fetch(`${API_URL}/cards`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    });

    const apiResponse = await handleApiResponse<GetCardsListResponse>(response);
    
    return validateSchema({ dto: apiResponse, schema: GetCardsListResponseSchema, schemaName: 'get/cardss' });
};