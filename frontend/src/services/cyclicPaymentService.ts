import { CreateCyclicPaymentResponse, CreateCyclicPaymentResponseSchema, DeleteCyclicPaymentResponse, DeleteCyclicPaymentResponseSchema, GetCyclicPaymentResponse, GetCyclicPaymentResponseSchema, GetCyclicPaymentsListResponse, GetCyclicPaymentsListResponseSchema, UpdateCyclicPaymentResponse, UpdateCyclicPaymentResponseSchema } from '../schemas/apiValidation/cyclicPaymentResponseSchema';
import { validateSchema } from '../schemas/apiValidation/validator';
import { API_URL } from './constants';
import { handleApiResponse } from './handleApiResponse';

export const createCyclicPaymentData = async (requestBody: object): Promise<CreateCyclicPaymentResponse> => {
    const response = await fetch(`${API_URL}/cyclic-payment`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody),
        credentials: 'include'
    });

    const apiResponse = await handleApiResponse<CreateCyclicPaymentResponse>(response);

    return validateSchema({ dto: apiResponse, schema: CreateCyclicPaymentResponseSchema, schemaName: '/cyclic-payment' });
};

export const getCyclicPaymentData = async (id: string): Promise<GetCyclicPaymentResponse> => {
    const response = await fetch(`${API_URL}/cyclic-payment/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    });

    const apiResponse = await handleApiResponse<GetCyclicPaymentResponse>(response);

    return validateSchema({ dto: apiResponse, schema: GetCyclicPaymentResponseSchema, schemaName: 'get/cyclic-payment/' });
};

export const deleteCyclicPaymentData = async (id: string): Promise<DeleteCyclicPaymentResponse> => {
    const response = await fetch(`${API_URL}/cyclic-payment/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    });

    const apiResponse = await handleApiResponse<DeleteCyclicPaymentResponse>(response);
    
    return validateSchema({ dto: apiResponse, schema: DeleteCyclicPaymentResponseSchema, schemaName: 'delete/cyclic-payment' });
};

export const updateCyclicPaymentData = async (id: string, requestBody: object): Promise<UpdateCyclicPaymentResponse> => {
    const response = await fetch(`${API_URL}/cyclic-payment/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody),
        credentials: 'include'
    });

    const apiResponse = await handleApiResponse<UpdateCyclicPaymentResponse>(response);
    
    return validateSchema({ dto: apiResponse, schema: UpdateCyclicPaymentResponseSchema, schemaName: 'update/cyclic-payment' });
};

export const getCyclicPaymentsData = async (): Promise<GetCyclicPaymentsListResponse> => {
    const response = await fetch(`${API_URL}/cyclic-payments`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    });

    const apiResponse = await handleApiResponse<GetCyclicPaymentsListResponse>(response);
    
    return validateSchema({ dto: apiResponse, schema: GetCyclicPaymentsListResponseSchema, schemaName: 'get/cyclic-payments' });
};