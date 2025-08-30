// types/reports.ts
export interface ReportRequest {
  report_type: 'expense' | 'invest' | 'financial';
}

export interface ReportResponse {
  message: string;
  filename: string;
}

export interface ReportFile {
  filename: string;
  path: string;
}