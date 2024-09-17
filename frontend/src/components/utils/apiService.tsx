export const fetchTransfersAnalysisData = async (url: string, body: object, setChartData: Function, setLoading: Function, setError: Function) => {
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

        const data = await response.json();
        setChartData(data.transfers);
    } catch (error) {
        setError(true);
        console.log("Error: ", error);
    } finally {
        setLoading(false);
    }
};