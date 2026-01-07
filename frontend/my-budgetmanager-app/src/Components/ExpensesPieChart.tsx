
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

export const COLORS = [
  '#7b2ff7', '#f357a8', '#ffb347', '#00c49f', '#ff8042', '#8884d8', '#82ca9d', '#ffc658', '#a4de6c', '#d0ed57', '#8dd1e1', '#d88884'
];

type PieData = { name: string; value: number };

interface ExpensesPieChartProps {
  data: PieData[];
  showLabels?: boolean;
}

const ExpensesPieChart: React.FC<ExpensesPieChartProps> = ({ data, showLabels = false }) => {
  if (!data || data.length === 0) return <div>אין נתוני הוצאות</div>;
  return (
    <ResponsiveContainer width="100%" height={320}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={120}
          label={showLabels ? (({ name, percent }: { name?: string; percent?: number }) =>
            `${name ?? ''} (${percent !== undefined ? (percent * 100).toFixed(0) : 0}%)`
          ) : false}
        >
          {data.map((_, idx: number) => (
            <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value: number | string | undefined) =>
          value !== undefined && value !== null && typeof value === 'number'
            ? value.toLocaleString()
            : value
        } />
      </PieChart>
    </ResponsiveContainer>
  );
}



export default ExpensesPieChart;

