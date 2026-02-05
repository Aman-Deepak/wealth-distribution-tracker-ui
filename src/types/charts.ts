export interface ChartRequest { chart_name: string; params?: Record<string, any>; }
export interface ChartResponse { labels: string[]; datasets: any[] | Record<string, any>; }
export interface TableRequest { table_name: string; params?: Record<string, any>; }
export interface TableResponse { html: string; }
export interface RawTableResponse {columns: string[], rows: (string | number)[][]}
