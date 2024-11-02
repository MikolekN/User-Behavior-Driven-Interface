import { BackendCyclicPayment } from '../components/utils/types/CyclicPayment';
import { API_URL } from './constants';
import { handleApiResponse } from './handleApiResponse';

interface CreateCyclicPaymentResponse {
    message: string;
    cyclic_payment: BackendCyclicPayment;
}

interface GetCyclicPaymentResponse {
    message: string;
    cyclic_payment: BackendCyclicPayment;
}

interface DeleteCyclicPaymentResponse {
    message: string;
}

interface UpdateCyclicPaymentResponse {
    message: string;
    cyclic_payment: BackendCyclicPayment;
}

interface GetCyclicPaymentsResponse {
    message: string;
    cyclic_payments: BackendCyclicPayment[];
}

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
    // add api response validation later

    return apiResponse;
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
    // add api response validation later

    return apiResponse;
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
    // add api response validation later

    return apiResponse;
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
    // add api response validation later

    return apiResponse;
};

export const getCyclicPaymentsData = async (): Promise<GetCyclicPaymentsResponse> => {
    const response = await fetch(`${API_URL}/cyclic-payments`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    });

    const apiResponse = await handleApiResponse<GetCyclicPaymentsResponse>(response);
    // add api response validation later

    return apiResponse;
};