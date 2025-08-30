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

export interface DashboardSummary {
  TOTAL_EXPENSES: string;
  AVG_MONTHLY_EXPENSE: string;
  HIGHEST_EXPENSE_MONTH: string;
  LOWEST_EXPENSE_MONTH: string;
  TOTAL_INVESTED: string;
  TOTAL_VALUE: string;
  TOTAL_PNL: string;
  WEIGHTED_RETURN: string;
  PROFIT_BOOKED_SUM: string;
  TOTAL_WEALTH: string;
  LIQUID_WEALTH: string;
  TOTAL_LOANS: string;
  BANK_BALANCE: string;
}

export interface DashboardInsights {
  HIGHEST_CATEGORY: string;
  HIGHEST_TYPE: string;
  AVG_MONTHLY_EXPENSE: string;
  YOY_EXPENSE: string;
  TOP_ASSET: string;
  BOTTOM_ASSET: string;
  LARGEST_HOLDING: string;
  TOP_RETIREMENT_ASSET: string;
  YOY_INVEST: string;
  CONCENTRATION_RISK: string;
  PORTFOLIO_RETURN: string;
  RETIREMENT_RETURN: string;
}