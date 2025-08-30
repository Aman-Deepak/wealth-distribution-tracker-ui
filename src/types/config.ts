// types/config.ts
export interface NAV {
  TYPE: string;
  FUND_NAME: string;
  UNIQUE_IDENTIFIER: string;
  NAV?: number;
  LAST_UPDATED?: string;
}

export interface YearlyClosingBankBalance {
  financial_year: string;
  closing_balance: number;
}

export interface Config {
  last_updated_date?: string;
  invest_last_updated_date?: string;
  expense_last_updated_date?: string;
  financial_last_updated_date?: string;
}
