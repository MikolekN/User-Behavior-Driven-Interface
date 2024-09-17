import { BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Bar, Legend } from 'recharts';
import { TransfersAnalysisChartProps } from '../utils/types/TransfersAnalysisChartTypes';

const colors: string[] = ['#00d800', '#ee0000']; // green, red hex code

const TransfersAnalysisChart = ( props: TransfersAnalysisChartProps ) => {
    return (
        <ResponsiveContainer width="100%" height={400}>
            <BarChart data={props.chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="interval" />
                <YAxis />
                <Tooltip />
                <Legend verticalAlign="top" height={30} />
                <CartesianGrid stroke="#f5f5f5" />
                {/* tutaj mozna dac jakies zmienne typu kolor primary, sedoncday czy coś */}
                <Bar dataKey="income" fill={colors[0]} radius={[10, 10, 0, 0]} /> 
                <Bar dataKey="outcome" fill={colors[1]} radius={[10, 10, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
  )
}

export default TransfersAnalysisChart