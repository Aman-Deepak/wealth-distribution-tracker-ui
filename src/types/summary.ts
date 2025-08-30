// types/summary.ts
export interface MonthlyDistribution {
  FISCAL_YEAR?: string;
  YEAR?: string;
  MONTH?: string;
  INCOME?: number;
  INV_BUY?: number;
  INV_SELL?: number;
  EXPENSE?: number;
  BANK?: number;
  TAX?: number;
  INTEREST_IN?: number;
  INTEREST_OUT?: number;
  LOAN_AMOUNT?: number;
  LOAN_REPAYMENT?: number;
}

export interface YearlyDistribution {
  FISCAL_YEAR: string;
  INCOME?: number;
  INV_BUY?: number;
  INV_SELL?: number;
  EXPENSE?: number;
  BANK?: number;
  TAX?: number;
  INTEREST_IN?: number;
  INTEREST_OUT?: number;
  LOAN_AMOUNT?: number;
  LOAN_REPAYMENT?: number;
}

export interface Savings {
  TYPE?: string;
  NAME: string;
  T_BUY?: number;
  T_SELL?: number;
  PROFIT_BOOKED?: number;
  CURRENT_INVESTED?: number;
  CURRENT_VALUE?: number;
  PROFIT_LOSS?: number;
  RETURN_PERCENTAGE?: number;
}
