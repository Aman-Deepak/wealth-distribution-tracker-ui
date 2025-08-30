// types/transactions.ts
export interface Income {
  id?: number;
  financial_year: string;
  year: string;
  month: string;
  day: string;
  salary: number;
  tax: number;
}

export interface Expense {
  id?: number;
  financial_year: string;
  year: string;
  month: string;
  day: string;
  type: string;
  category: string;
  cost: number;
}

export interface Investment {
  id?: number;
  financial_year: string;
  year: string;
  month: string;
  day: string;
  type: string;
  folio_number?: string;
  name: string;
  type_of_order: string;
  units?: number;
  nav?: number;
  cost: number;
}

export interface Loan {
  id?: number;
  financial_year: string;
  year: string;
  month: string;
  day: string;
  type: string;
  name: string;
  interest: number;
  loan_amount?: number;
  loan_repayment?: number;
  cost: number;
}