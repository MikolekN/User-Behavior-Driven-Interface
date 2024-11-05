export interface ChartData {
    interval: string;
    income: number;
    outcome: number;
}

export interface TransfersAnalysisChartProps {
    chartData: ChartData[] | null;
    truncateText?: boolean;
}