
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

export const COLORS = [
  '#7b2ff7', '#f357a8', '#ffb347', '#00c49f', '#ff8042', '#8884d8', '#82ca9d', '#ffc658', '#a4de6c', '#d0ed57', '#8dd1e1', '#d88884',
  '#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff',
  '#9a6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080', '#ffffff', '#000000'
];

type PieData = { name: string; value: number };

interface ExpensesPieChartProps {
  data: PieData[];
  showLabels?: boolean;
}

const ExpensesPieChart: React.FC<ExpensesPieChartProps> = ({ data, showLabels = false }) => {
  if (!data || data.length === 0) return <div>אין נתוני הוצאות</div>;

  // Generate unique HSL color for each category
  const getHSLColor = (idx: number, total: number) => {
    const hue = Math.round((360 * idx) / total);
    return `hsl(${hue}, 70%, 55%)`;
  };

  // Map category names to unique HSL colors
  const categoryNames = data.map(item => item.name);
  const categoryColorMap: { [key: string]: string } = {};
  categoryNames.forEach((name, idx) => {
    categoryColorMap[name] = getHSLColor(idx, categoryNames.length);
  });

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
          {data.map((item, idx: number) => (
            <Cell key={`cell-${idx}`} fill={categoryColorMap[item.name]} />
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

