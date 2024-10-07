import { ChartData } from "../components/utils/types/TransfersAnalysisChartTypes";

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
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body),
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data: { transfers: ChartData[] } = await response.json();
        setChartData(data.transfers);
    } catch (error) {
        setError(true);
        console.error("Error: ", error);
    } finally {
        setLoading(false);
    }
};
