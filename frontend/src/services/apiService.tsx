import { ChartData } from '../components/utils/types/TransfersAnalysisChartTypes';

interface TransfersResponse {
    transfers: ChartData[];
}

const isTransfersResponse = (data: unknown): data is TransfersResponse => {
    return (
        typeof data === 'object' &&
        data !== null &&
        'transfers' in data &&
        Array.isArray((data as TransfersResponse).transfers) &&
        (data as TransfersResponse).transfers.every(
            transfer => typeof transfer === 'object'
        )
    );
};

export const fetchTransfersAnalysisData = async (
    url: string,
    body: object,
    setChartData: (data: ChartData[]) => void,
    setLoading: (loading: boolean) => void,
    setError: (hasError: boolean) => void
) => {
    setLoading(true);
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body),
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data: unknown = await response.json();

        if (isTransfersResponse(data)) {
            setChartData(data.transfers);
        } else {
            throw new Error('Unexpected response format');
        }
    } catch (error) {
        setError(true);
        console.error('Error: ', error);
    } finally {
        setLoading(false);
    }
};