import { API_URL } from './constants';
import { handleApiResponse } from './handleApiResponse';
import { ChartData } from '../components/utils/types/TransfersAnalysisChartTypes';
import { TransactionsHistoryType } from '../components/utils/types/TransfersTypes';
import { validateSchema } from '../schemas/apiValidation/validator';
import { GetTransfersAnalysisResponse, GetTransfersAnalysisResponseSchema as schema } from '../schemas/apiValidation/transferResponseSchema';

// interface GetTransfersAnalysisResponse {
//     message: string;
//     transfers: ChartData[];
// }

interface GetTransfersResponse {
    message: string;
    transfers: TransactionsHistoryType[];
}

interface CreateTransferResponse {
    message: string;
}

interface CreateLoanResponse {
    message: string;
}

// const isGetTransfersAnalysisResponse = (data: unknown): data is GetTransfersAnalysisResponse => {
//     return (
//         typeof data === 'object' &&
//         data !== null &&
//         'transfers' in data &&
//         Array.isArray((data as GetTransfersAnalysisResponse).transfers) &&
//         (data as GetTransfersAnalysisResponse).transfers.every(
//             (transfer) =>
//                 typeof transfer === 'object' &&
//                 transfer !== null &&
//                 'income' in transfer && typeof transfer.income === 'number' &&
//                 'interval' in transfer && typeof transfer.interval === 'string' &&
//                 'outcome' in transfer && typeof transfer.outcome === 'number'
//         )
//     );
// };

const validate = (dto: unknown): GetTransfersAnalysisResponse => {
    console.log("wesz")
    return validateSchema({ dto, schema, schemaName: "/transfers/analysis/" });
}

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
    // if (isGetTransfersAnalysisResponse(apiResponse)) {
    //     return apiResponse;
    // } else {
    //     throw new Error('Unexpected response format');
    // }

    return validate(apiResponse);
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
    // add api response validation later

    return apiResponse;
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

    const apiResponse = await handleApiResponse<CreateTransferResponse>(response);
    // add api response validation later

    return apiResponse;
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
    // add api response validation later

    return apiResponse;
};
