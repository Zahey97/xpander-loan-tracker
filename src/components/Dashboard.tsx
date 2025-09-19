import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { LoanSummary, ChartDataPoint } from '../types';
import Card from './Card';

interface DashboardProps {
  summary: LoanSummary;
  chartData: ChartDataPoint[];
}

const currencyFormatter = new Intl.NumberFormat('en-MY', {
  style: 'currency',
  currency: 'MYR',
});

const Dashboard: React.FC<DashboardProps> = ({ summary, chartData }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card title="Outstanding Balance">
          <p className="text-2xl font-bold text-blue-600">{currencyFormatter.format(summary.outstandingBalance)}</p>
        </Card>
        <Card title="Remaining Months">
          <p className="text-2xl font-bold text-slate-700">{summary.remainingMonths}</p>
        </Card>
        <Card title="Next Payment Due">
          <p className="text-lg font-semibold text-slate-700">{summary.nextPaymentDueDate}</p>
        </Card>
        <Card title="Total Paid">
          <p className="text-2xl font-bold text-green-600">{currencyFormatter.format(summary.totalPaid)}</p>
        </Card>
        <Card title="Principal Paid">
          <p className="text-lg font-semibold text-slate-700">{currencyFormatter.format(summary.principalPaid)}</p>
           <p className="text-sm text-slate-500">of {currencyFormatter.format(summary.totalPrincipal)}</p>
        </Card>
        <Card title="Profit Paid">
          <p className="text-lg font-semibold text-slate-700">{currencyFormatter.format(summary.profitPaid)}</p>
          <p className="text-sm text-slate-500">of {currencyFormatter.format(summary.totalProfit)}</p>
        </Card>
      </div>

       <Card title="Loan Progress">
        <div className="h-64 md:h-80 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
            <AreaChart
                data={chartData}
                margin={{
                top: 5,
                right: 20,
                left: 30,
                bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12}/>
                <YAxis stroke="#64748b" fontSize={12} tickFormatter={(value) => currencyFormatter.format(value as number)} />
                <Tooltip 
                  formatter={(value: number) => currencyFormatter.format(value)} 
                  contentStyle={{
                    borderRadius: '0.5rem',
                    borderColor: '#e2e8f0',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
                  }}
                  />
                <Legend />
                <Area type="monotone" dataKey="principalPaid" stackId="1" stroke="#3b82f6" fill="#60a5fa" name="Principal Paid" />
                <Area type="monotone" dataKey="profitPaid" stackId="1" stroke="#10b981" fill="#34d399" name="Profit Paid" />
                <Area type="monotone" dataKey="remainingBalance" stroke="#ef4444" fill="#f87171" name="Remaining Balance" />
            </AreaChart>
            </ResponsiveContainer>
        </div>
       </Card>
    </div>
  );
};

export default Dashboard;
