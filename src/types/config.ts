// types/config.ts
export interface NAV {
  type: string;
  fund_name: string;
  unique_identifier: string;
  nav?: number;
  last_updated?: string;
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
