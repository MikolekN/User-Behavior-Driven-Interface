import { API_URL } from './constants';
import { handleApiResponse } from './handleApiResponse';
import { validateSchema } from '../schemas/apiValidation/validator';
import { CreateLoanResponse, CreateLoanResponseSchema, CreateTransferResponseSchema, CreateTransfersResponse, GetTransfersAnalysisResponse, GetTransfersAnalysisResponseSchema, GetTransfersResponse, GetTransfersResponseSchema } from '../schemas/apiValidation/transferResponseSchema';

export const fetchTransfersAnalysisData = async (interval: string, requestBody: object) => {
    const response = await fetch(`${API_URL}/transfers/analysis/${interval}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody),
        credentials: 'include'
    });

    const apiResponse = await handleApiResponse<GetTransfersAnalysisResponse>(response);

    return validateSchema({ dto: apiResponse, schema: GetTransfersAnalysisResponseSchema, schemaName: "/transfers/analysis" });
};

export const fetchTransfersData = async () => {
    const response = await fetch(`${API_URL}/transfers`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    });

    const apiResponse = await handleApiResponse<GetTransfersResponse>(response);

    return validateSchema({ dto: apiResponse, schema: GetTransfersResponseSchema, schemaName: "/transfers" });
};

export const createTransferData = async (requestBody: object) => {
    const response = await fetch(`${API_URL}/transfer`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody),
        credentials: 'include'
    });

    const apiResponse = await handleApiResponse<CreateTransfersResponse>(response);

    return validateSchema({ dto: apiResponse, schema: CreateTransferResponseSchema, schemaName: "/transfer" });
};

export const createLoanData = async (requestBody: object) => {
    const response = await fetch(`${API_URL}/transfer/loan`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody),
        credentials: 'include'
    });

    const apiResponse = await handleApiResponse<CreateLoanResponse>(response);

    return validateSchema({ dto: apiResponse, schema: CreateLoanResponseSchema, schemaName: "/transfer/loan" });
};
