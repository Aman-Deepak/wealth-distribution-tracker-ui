// types/config.ts
export interface NAV {
  TYPE: string;
  FUND_NAME: string;
  UNIQUE_IDENTIFIER: string;
  NAV?: number;
  LAST_UPDATED?: string;
}

export interface YearlyClosingBankBalance {
  FINANCIAL_YEAR: string;
  CLOSING_BALANCE: number;
}

export interface Config {
  LAST_UPDATED_DATE?: string;
  INVEST_LAST_UPDATED_DATE?: string;
  EXPENSE_LAST_UPDATED_DATE?: string;
  FINANCIAL_LAST_UPDATED_DATE?: string;
}
