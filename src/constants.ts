import type { LoanInfo } from './types';

export const INITIAL_LOAN_INFO: LoanInfo = {
  bankName: 'Affin Islamic Bank Berhad',
  accountPreferredName: 'AITAB ACT',
  accountNo: 'xxxxxxxxxx', // To be filled by user
  productType: 'AITAB ACT',
  vehicleNo: 'Vxx xxxx', // To be filled by user
  profitRate: 2.44, // As percentage
  tenureMonths: 108,
  monthlyInstalment: 580,
  paymentDueDate: 19,
  totalUnearnedProfit: 11265.48,
  principal: 51300.00,
};
