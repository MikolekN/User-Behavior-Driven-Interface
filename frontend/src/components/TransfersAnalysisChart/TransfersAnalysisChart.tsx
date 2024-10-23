import { useCallback, useEffect, useRef, useState } from 'react';
import { BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Bar, Legend } from 'recharts';
import { TransfersAnalysisChartProps } from '../utils/types/TransfersAnalysisChartTypes';
import { CHART_HEIGHT, COLORS, LEGEND_HEIGHT } from '../constants';

const TransfersAnalysisChart = (props: TransfersAnalysisChartProps) => {
    const chartRef = useRef<HTMLDivElement>(null);
    const [columnWidth, setColumnWidth] = useState<number>(0);
    const canvasRef = useRef<HTMLCanvasElement>(document.createElement('canvas'));

    const getTextWidth = useCallback((text: string, font: string = '20px Inter, system-ui, Avenir, Helvetica, Arial, sans-serif') => {
        const context = canvasRef.current.getContext('2d');
        if (context) {
            context.font = font;
            return context.measureText(text).width;
        }
        return 0;
    }, []);

    const calculateColumnWidth = useCallback(() => {
        if (chartRef.current && props.chartData!.length > 0) {
            const chartWidth = chartRef.current.offsetWidth;
            const numberOfBars = props.chartData!.length;
            const calculatedColumnWidth = chartWidth / numberOfBars;
            setColumnWidth(calculatedColumnWidth);
        }
    }, [props.chartData!.length]);

    useEffect(() => {
        calculateColumnWidth();
    }, [calculateColumnWidth]);

    useEffect(() => {
        const handleResize = () => {
            calculateColumnWidth();
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [calculateColumnWidth]);

    const formatMonth = (interval: string) => {
        if (!props.truncateText) {
            return interval;
        }
        let shortenedName = interval;
        let textWidth = getTextWidth(shortenedName);
        while (textWidth > columnWidth && shortenedName.length > 1) {
            shortenedName = shortenedName.slice(0, -1);
            textWidth = getTextWidth(shortenedName);
        }
        if (interval != shortenedName) {
            shortenedName = shortenedName.slice(0, -1) + '.';
            textWidth = getTextWidth(shortenedName);
        }
        return shortenedName;
    };

    return (
        <div ref={chartRef} style={{ width: '100%' }}>
            <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
                <BarChart data={props.chartData!}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="interval" tickFormatter={formatMonth} />
                    <YAxis />
                    <Tooltip />
                    <Legend verticalAlign="top" height={LEGEND_HEIGHT} />
                    <CartesianGrid stroke="#f5f5f5" />
                    {/* tutaj mozna dac jakies zmienne typu kolor primary, sedoncday czy coś */}
                    <Bar dataKey="income" fill={COLORS.GREEN} radius={[10, 10, 0, 0]} />
                    <Bar dataKey="outcome" fill={COLORS.RED} radius={[10, 10, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TransfersAnalysisChart;
