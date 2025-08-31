// services/api.ts - All API calls mapped to your backend endpoints
import { apiClient } from './apiClient';
import {
  LoginCredentials,
  RegisterCredentials,
  AuthToken,
  UserProfile,
  Income,
  Expense,
  Investment,
  Loan,
  MonthlyDistribution,
  YearlyDistribution,
  Savings,
  NAV,
  YearlyClosingBankBalance,
  Config,
  UploadHistory,
  ReportRequest,
  ReportResponse,
  ReportFile,
  PaginationParams,
  DashboardInsights,
  DashboardSummary,
  ChartResponse,
  TableResponse,
} from '../types';

// Authentication API
export const authAPI = {
  login: (credentials: LoginCredentials): Promise<AuthToken> =>
    apiClient.post('/auth/login', credentials),

  register: (credentials: RegisterCredentials): Promise<AuthToken> =>
    apiClient.post('/auth/register', credentials),

  getProfile: (): Promise<UserProfile> =>
    apiClient.get('/auth/profile'),

  healthCheck: (): Promise<{ status: string }> =>
    apiClient.get('/auth/health'),
};

// Transaction APIs
export const incomeAPI = {
  getIncome: (params?: PaginationParams): Promise<Income[]> =>
    apiClient.get('/income', { params }),

  addIncome: (income: Omit<Income, 'id'>): Promise<Income> =>
    apiClient.post('/income', income),
};

export const expenseAPI = {
  getExpenses: (params?: PaginationParams): Promise<Expense[]> =>
    apiClient.get('/expense', { params }),

  addExpense: (expense: Omit<Expense, 'id'>): Promise<Expense> =>
    apiClient.post('/expense', expense),
};

export const investmentAPI = {
  getInvestments: (params?: PaginationParams): Promise<Investment[]> =>
    apiClient.get('/invest', { params }),

  addInvestment: (investment: Omit<Investment, 'id'>): Promise<Investment> =>
    apiClient.post('/invest', investment),
};

export const loanAPI = {
  getLoans: (params?: PaginationParams): Promise<Loan[]> =>
    apiClient.get('/loan', { params }),

  addLoan: (loan: Omit<Loan, 'id'>): Promise<Loan> =>
    apiClient.post('/loan', loan),
};

// Summary APIs
export const summaryAPI = {
  getMonthlyDistribution: (financial_year?: string): Promise<MonthlyDistribution[]> =>
    apiClient.get('/summary/monthly', { params: { financial_year } }),

  getYearlyDistribution: (financial_year?: string): Promise<YearlyDistribution[]> =>
    apiClient.get('/summary/yearly', { params: { financial_year } }),

  getSavings: (): Promise<Savings[]> =>
    apiClient.get('/summary/savings'),

  updateSavings: (): Promise<{ message: string }> =>
    apiClient.put('/summary/saving/update'),

  getDashboardSummary: (): Promise<DashboardSummary> =>
    apiClient.get('/summary/dashboard'),

  getDashboardInsights: (): Promise<DashboardInsights> =>
    apiClient.get('/summary/dashboard/insights'),
};

// File Upload APIs
export const uploadAPI = {
  uploadFile: (file: File, onProgress?: (progress: number) => void): Promise<{ message: string }> =>
    apiClient.uploadFile('/upload', file, onProgress),

  getUploadHistory: (): Promise<UploadHistory[]> =>
    apiClient.get('/upload/history'),
};

// Reports APIs
export const reportsAPI = {
  generateReport: (request: ReportRequest): Promise<ReportResponse> =>
    apiClient.post('/reports/generate', null, { params: request }),

  listReports: (): Promise<ReportFile[]> =>
    apiClient.get('/reports/list'),

  downloadReport: (filename: string): Promise<Blob> =>
    apiClient.get(`/reports/download/${filename}`, { responseType: 'blob' }),
};

// Configuration APIs
export const configAPI = {
  // NAV Management
  getNavs: (): Promise<NAV[]> =>
    apiClient.get('/config/nav'),

  addNav: (nav: Omit<NAV, 'LAST_UPDATED'>): Promise<NAV> =>
    apiClient.post('/config/nav', nav),

  updateNavs: (): Promise<NAV[]> =>
    apiClient.put('/config/nav/update'),

  // Bank Balance
  getYearlyClosingBalance: (financial_year?: string): Promise<YearlyClosingBankBalance> =>
    apiClient.get('/config/yearly-closing-bank-balance', { params: { financial_year } }),

  createYearlyClosingBalance: (balance: YearlyClosingBankBalance): Promise<YearlyClosingBankBalance> =>
    apiClient.post('/config/yearly-closing-bank-balance', balance),

  updateYearlyClosingBalance: (closing_balance: YearlyClosingBankBalance): Promise<YearlyClosingBankBalance> =>
    apiClient.put('/config/yearly-closing-bank-balance', closing_balance),

  // System Config
  getConfig: (): Promise<Config> =>
    apiClient.get('/config/config'),

  updateConfig: (field_name: string, value: string): Promise<Config> =>
    apiClient.put('/config/config/update', { FIELD_NAME: field_name, VALUE: value }),
};

// Charts & Tables
export const chartsAPI = {
  getChartData: (chart_name: string, params = {}): Promise<ChartResponse> =>
    apiClient.post<{ labels: string[]; datasets: any[] | Record<string, any> }>('/charts/data', { chart_name, params }),
};

export const tablesAPI = {
  getTableData: (table_name: string, params = {}): Promise<TableResponse> =>
    apiClient.post<{ html: string }>('/tables/data', { table_name, params }),
};


// Utility function to handle API errors
export const handleApiError = (error: any): string => {
  if (error.response?.data?.detail) {
    return error.response.data.detail;
  }
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};