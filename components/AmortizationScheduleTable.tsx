
import React from 'react';
import type { AmortizationEntry } from '../types';
import Card from './Card';

interface AmortizationScheduleTableProps {
  schedule: AmortizationEntry[];
}

const currencyFormatter = new Intl.NumberFormat('en-MY', {
  style: 'currency',
  currency: 'MYR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});


const AmortizationScheduleTable: React.FC<AmortizationScheduleTableProps> = ({ schedule }) => {
  return (
    <Card title="Amortization Schedule">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Month</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Instalment</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Principal</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Profit</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Outstanding</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {schedule.map((entry) => (
              <tr key={entry.month} className={`${entry.paid ? 'bg-green-50' : ''} hover:bg-slate-50`}>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-slate-900">{entry.month}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600">{currencyFormatter.format(entry.monthlyInstalment)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600">{currencyFormatter.format(entry.principalComponent)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600">{currencyFormatter.format(entry.profitComponent)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-slate-800">{currencyFormatter.format(entry.totalOutstanding)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  {entry.paid ? (
                     <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Paid</span>
                  ) : (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Due</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default AmortizationScheduleTable;
