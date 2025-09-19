import { useMemo } from 'react';
import type { LoanInfo, Payment, AmortizationEntry, LoanSummary, ChartDataPoint } from '../types';

// Rule of 78 Calculation Logic for AITAB
const calculateAitabSchedule = (loanInfo: LoanInfo): AmortizationEntry[] => {
  const { tenureMonths, monthlyInstalment, totalUnearnedProfit, principal } = loanInfo;
  
  const sumOfDigits = (tenureMonths * (tenureMonths + 1)) / 2;
  const schedule: AmortizationEntry[] = [];
  let currentPrincipal = principal;
  let currentProfit = totalUnearnedProfit;

  const today = new Date();

  for (let i = 1; i <= tenureMonths; i++) {
    const profitPortion = ((tenureMonths - i + 1) / sumOfDigits) * totalUnearnedProfit;
    const principalPortion = monthlyInstalment - profitPortion;

    currentPrincipal -= principalPortion;
    currentProfit -= profitPortion;
    
    // Estimate payment date
    const paymentDate = new Date(today.getFullYear(), today.getMonth() + i -1, loanInfo.paymentDueDate);


    schedule.push({
      month: i,
      paymentDate: paymentDate.toLocaleDateString('en-CA'),
      monthlyInstalment,
      principalComponent: principalPortion,
      profitComponent: profitPortion,
      remainingPrincipal: Math.max(0, currentPrincipal),
      remainingProfit: Math.max(0, currentProfit),
      totalOutstanding: Math.max(0, currentPrincipal + currentProfit),
      paid: false,
      paidAmount: 0,
    });
  }
  
  // Adjust last month to ensure balances are zero
  if(schedule.length > 0){
      const lastEntry = schedule[schedule.length - 1];
      const principalAdjustment = lastEntry.remainingPrincipal;
      lastEntry.principalComponent += principalAdjustment;
      lastEntry.remainingPrincipal = 0;
      
      const profitAdjustment = lastEntry.remainingProfit;
      lastEntry.profitComponent += profitAdjustment;
      lastEntry.remainingProfit = 0;

      lastEntry.totalOutstanding = 0;
  }

  return schedule;
};


export const useAitabLoan = (loanInfo: LoanInfo, payments: Payment[]) => {
  const processedLoanData = useMemo(() => {
    const baseSchedule = calculateAitabSchedule(loanInfo);
    const updatedSchedule = [...baseSchedule.map(entry => ({ ...entry }))];

    let principalPaid = 0;
    let profitPaid = 0;
    
    const sortedPayments = [...payments].sort((a, b) => new Date(a.paymentDate).getTime() - new Date(b.paymentDate).getTime());

    sortedPayments.forEach(payment => {
        const nextUnpaidEntry = updatedSchedule.find(e => !e.paid);
        if (nextUnpaidEntry) {
            nextUnpaidEntry.paid = true;
            nextUnpaidEntry.paidAmount = payment.amount;
            nextUnpaidEntry.paymentId = payment.id;
            principalPaid += nextUnpaidEntry.principalComponent;
            profitPaid += nextUnpaidEntry.profitComponent;
        }
    });

    const lastPaidEntry = updatedSchedule.slice().reverse().find(e => e.paid);
    const firstUnpaidEntry = updatedSchedule.find(e => !e.paid);

    const outstandingBalance = firstUnpaidEntry ? firstUnpaidEntry.totalOutstanding + firstUnpaidEntry.monthlyInstalment : (lastPaidEntry ? lastPaidEntry.totalOutstanding : loanInfo.principal + loanInfo.totalUnearnedProfit);
    const remainingMonths = updatedSchedule.filter(e => !e.paid).length;
    
    const today = new Date();
    const nextPaymentDate = firstUnpaidEntry
      ? new Date(firstUnpaidEntry.paymentDate)
      : new Date(today.getFullYear(), today.getMonth() + 1, loanInfo.paymentDueDate);
    
    while (nextPaymentDate < today && remainingMonths > 0) {
        nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
    }

    const summary: LoanSummary = {
        outstandingBalance,
        remainingMonths,
        nextPaymentDueDate: nextPaymentDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric'}),
        totalPaid: payments.reduce((sum, p) => sum + p.amount, 0),
        principalPaid,
        profitPaid,
        totalPrincipal: loanInfo.principal,
        totalProfit: loanInfo.totalUnearnedProfit,
        remainingPrincipal: loanInfo.principal - principalPaid,
        remainingProfit: loanInfo.totalUnearnedProfit - profitPaid,
    };
    
    const chartData: ChartDataPoint[] = updatedSchedule.map(entry => ({
      month: entry.month,
      name: `M${entry.month}`,
      principalPaid: entry.paid ? entry.principalComponent : 0,
      profitPaid: entry.paid ? entry.profitComponent : 0,
      remainingBalance: entry.totalOutstanding,
    })).reduce<ChartDataPoint[]>((acc, current) => {
        if (acc.length > 0) {
            const last = acc[acc.length - 1];
            current.principalPaid += last.principalPaid;
            current.profitPaid += last.profitPaid;
        }
        acc.push(current);
        return acc;
    }, []);

    return { schedule: updatedSchedule, summary, chartData };
  }, [loanInfo, payments]);

  return processedLoanData;
};
