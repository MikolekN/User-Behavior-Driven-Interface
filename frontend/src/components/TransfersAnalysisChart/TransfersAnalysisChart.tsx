import { useCallback, useEffect, useRef, useState } from 'react';
import { BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Bar, Legend } from 'recharts';
import { TransfersAnalysisChartProps } from '../utils/types/TransfersAnalysisChartTypes';

const colors: string[] = ['#00d800', '#ee0000']; // green, red hex code

const TransfersAnalysisChart = (props: TransfersAnalysisChartProps) => {
    const chartRef = useRef<HTMLDivElement>(null);
    const [columnWidth, setColumnWidth] = useState<number>(0);

    const getTextWidth = (text: string, font: string = '24px Arial') => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (context) {
            context.font = font;
            return context.measureText(text).width;
        }
        return 0;
    };

    const calculateColumnWidth = useCallback(() => {
        if (chartRef.current && props.chartData.length > 0) {
            const chartWidth = chartRef.current.offsetWidth;
            const numberOfBars = props.chartData.length;
            const calculatedColumnWidth = chartWidth / numberOfBars;
            setColumnWidth(calculatedColumnWidth);
        }
    }, [props.chartData.length]);

    useEffect(() => {
        calculateColumnWidth()
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
        let shortenedName = interval;
        let textWidth = getTextWidth(shortenedName);
        while (textWidth > columnWidth && shortenedName.length > 1) {
            shortenedName = shortenedName.slice(0, -1);
            textWidth = getTextWidth(shortenedName);
            console.log(`Shortened to "${shortenedName}", new width: ${textWidth}`);
        }
        if (interval != shortenedName) {
            shortenedName = shortenedName.slice(0, -1) + '.';
        }
        return shortenedName;
    };

    return (
        <div ref={chartRef} style={{ width: '100%' }}>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={props.chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="interval" tickFormatter={formatMonth} />
                    <YAxis />
                    <Tooltip />
                    <Legend verticalAlign="top" height={30} />
                    <CartesianGrid stroke="#f5f5f5" />
                    {/* tutaj mozna dac jakies zmienne typu kolor primary, sedoncday czy coś */}
                    <Bar dataKey="income" fill={colors[0]} radius={[10, 10, 0, 0]} />
                    <Bar dataKey="outcome" fill={colors[1]} radius={[10, 10, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TransfersAnalysisChart;
