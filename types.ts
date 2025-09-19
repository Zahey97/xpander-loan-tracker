export interface LoanInfo {
  bankName: string;
  accountPreferredName: string;
  accountNo: string;
  productType: string;
  vehicleNo: string;
  profitRate: number;
  tenureMonths: number;
  monthlyInstalment: number;
  paymentDueDate: number;
  totalUnearnedProfit: number;
  principal: number;
}

export interface AmortizationEntry {
  month: number;
  paymentDate: string;
  monthlyInstalment: number;
  principalComponent: number;
  profitComponent: number;
  remainingPrincipal: number;
  remainingProfit: number;
  totalOutstanding: number;
  paid: boolean;
  paidAmount: number;
  paymentId?: string;
}

export interface Payment {
  id: string;
  paymentDate: string; // YYYY-MM-DD
  amount: number;
  notes?: string;
  fileName?: string;
}

export interface LoanSummary {
  outstandingBalance: number;
  remainingMonths: number;
  nextPaymentDueDate: string;
  totalPaid: number;
  principalPaid: number;
  profitPaid: number;
  totalPrincipal: number;
  totalProfit: number;
  remainingPrincipal: number;
  remainingProfit: number;
}

export type Tab = 'dashboard' | 'schedule' | 'history';

export interface ChartDataPoint {
  month: number;
  name: string;
  principalPaid: number;
  profitPaid: number;
  remainingBalance: number;
}
