import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList, Cell } from 'recharts';

interface IncomeExpenseBarProps {
  totalIncome: number;
  totalExpenses: number;
}

const IncomeExpenseBar: React.FC<IncomeExpenseBarProps> = ({ totalIncome, totalExpenses }) => {
  const data = [
    {
      name: 'הכנסות',
      value: totalIncome,
      fill: 'rgba(55, 120, 255, 0.65)', // כחול שקוף
    },
    {
      name: 'הוצאות',
      value: totalExpenses,
      fill: 'rgba(255, 60, 60, 0.65)', // אדום שקוף
    },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 40, right: 30, left: 0, bottom: 0 }}>
        <XAxis dataKey="name" tick={{ fontSize: 16, fontWeight: 700 }} />
        <YAxis tick={{ fontSize: 14 }} />
        <Tooltip formatter={(value) =>
          value !== undefined && value !== null && typeof value === 'number'
            ? value.toLocaleString()
            : value
        } />
        <Bar dataKey="value" isAnimationActive>
          {data.map((entry, idx) => (
            <Cell key={`cell-${idx}`} fill={entry.fill} />
          ))}
          <LabelList
            dataKey="value"
            position="top"
            formatter={(v) =>
              v !== undefined && v !== null && typeof v === 'number'
                ? v.toLocaleString()
                : v
            }
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default IncomeExpenseBar;
