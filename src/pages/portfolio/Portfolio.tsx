// src/pages/portfolio/Portfolio.tsx
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { chartsAPI, tablesAPI } from "../../services/api";
import { Card, CardHeader, CardBody } from "../../components/ui";
import { ChartResponse } from "../../types";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#14B8A6"];

// Format large numbers to lakhs/crores
const formatCurrency = (value: number): string => {
  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(1)}Cr`;
  } else if (value >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`;
  } else if (value >= 1000) {
    return `₹${(value / 1000).toFixed(1)}K`;
  }
  return `₹${value.toFixed(0)}`;
};

// Format number with Indian locale
const formatIndianCurrency = (value: number): string => {
  return `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
};

// Transform column-oriented data to row-oriented data
const transformColumnDataToRows = (data: any): { columns: string[], rows: any[][] } | null => {
  if (!data || typeof data !== 'object') {
    return null;
  }

  const columns = Object.keys(data);
  if (columns.length === 0) {
    return null;
  }

  // Get the number of rows from the first column
  const firstColumnData = data[columns[0]];
  const rowIndices = Object.keys(firstColumnData);
  
  // Build rows
  const rows = rowIndices.map(index => {
    return columns.map(column => data[column][index]);
  });

  return { columns, rows };
};

// Custom tooltip for pie charts with percentage
const CustomPieTooltip = ({ active, payload, total }: any) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    const percentage = ((value / total) * 100).toFixed(1);
    return (
      <div className="bg-white px-3 py-2 shadow-lg rounded-lg border border-gray-200">
        <p className="font-medium text-gray-900">{payload[0].name}</p>
        <p className="text-sm text-gray-600">
          {formatIndianCurrency(value)} ({percentage}%)
        </p>
      </div>
    );
  }
  return null;
};

// Loading skeleton component
const ChartSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
    <div className="h-[250px] bg-gray-100 rounded flex items-center justify-center">
      <div className="w-32 h-32 bg-gray-200 rounded-full"></div>
    </div>
  </div>
);

const TableSkeleton = () => (
  <div className="animate-pulse space-y-3">
    <div className="h-10 bg-gray-200 rounded"></div>
    {[...Array(5)].map((_, i) => (
      <div key={i} className="h-12 bg-gray-100 rounded"></div>
    ))}
  </div>
);

// Table component that renders transformed data
interface TableData {
  columns: string[];
  rows: (string | number)[][];
}

const DataTable: React.FC<{ data: TableData | null | undefined }> = ({ data }) => {
  if (!data || !data.columns || !data.rows || data.rows.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No data available
      </div>
    );
  }

  // Helper function to format cell values
  const formatCellValue = (value: string | number, columnName: string): string => {
    if (typeof value === 'number') {
      // Check if column name suggests it's a currency value
      const isCurrency = columnName.toLowerCase().includes('amount') || 
                        columnName.toLowerCase().includes('total') ||
                        columnName.toLowerCase().includes('expense') ||
                        columnName.toLowerCase().includes('saving') ||
                        columnName.toLowerCase().includes('income') ||
                        columnName.toLowerCase().includes('value') ||
                        columnName.toLowerCase().includes('buy') ||
                        columnName.toLowerCase().includes('sell') ||
                        columnName.toLowerCase().includes('invested') ||
                        columnName.toLowerCase().includes('profit') ||
                        columnName.toLowerCase().includes('loss') ||
                        columnName.includes('T_BUY') ||
                        columnName.includes('T_SELL') ||
                        columnName.includes('CURRENT_');
      
      const isPercentage = columnName.toLowerCase().includes('percentage') ||
                          columnName.toLowerCase().includes('return');
      
      if (isPercentage) {
        return `${value.toFixed(2)}%`;
      } else if (isCurrency) {
        return formatIndianCurrency(value);
      }
      return value.toLocaleString('en-IN', { maximumFractionDigits: 2 });
    }
    return String(value);
  };

  return (
    <table className="min-w-full divide-y divide-gray-200 border-collapse">
      <thead className="bg-gray-100 sticky top-0">
        <tr>
          {data.columns.map((column, idx) => (
            <th
              key={idx}
              className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b-2 border-gray-300 whitespace-nowrap"
            >
              {column.replace(/_/g, ' ')}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {data.rows.map((row, rowIdx) => (
          <tr
            key={rowIdx}
            className="hover:bg-blue-50 transition-colors even:bg-gray-50"
          >
            {row.map((cell, cellIdx) => (
              <td
                key={cellIdx}
                className="px-4 py-3 text-sm text-gray-700 border-b border-gray-200 whitespace-nowrap"
              >
                {formatCellValue(cell, data.columns[cellIdx])}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const Portfolio: React.FC = () => {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(["Expense"]);
  const [activeTab, setActiveTab] = useState("expense");

  // Fetch charts
  const { data: expensePie, isLoading: expensePieLoading } = useQuery<ChartResponse>({
    queryKey: ["expensePie"],
    queryFn: () => chartsAPI.getChartData("expense_type_pie"),
  });
  const { data: savingsPies, isLoading: savingsPiesLoading } = useQuery<any>({
    queryKey: ["savingsPies"],
    queryFn: () => chartsAPI.getChartData("savings_pie"),
  });
  const { data: monthlyTrends, isLoading: trendsLoading } = useQuery<ChartResponse>({
    queryKey: ["monthlyTrends"],
    queryFn: () => chartsAPI.getChartData("financial_monthly_trends"),
  });

  // Fetch tables - raw column-oriented data
  const { data: expenseTableRaw, isLoading: expenseTableLoading } = useQuery<any>({
    queryKey: ["expenseTable"],
    queryFn: () => tablesAPI.getTableData("expense_summary"),
  });
  const { data: savingsTableRaw, isLoading: savingsTableLoading } = useQuery<any>({
    queryKey: ["savingsTable"],
    queryFn: () => tablesAPI.getTableData("savings_summary"),
  });
  const { data: yearlyDistTableRaw, isLoading: yearlyTableLoading } = useQuery<any>({
    queryKey: ["yearlyDistTable"],
    queryFn: () => tablesAPI.getTableData("yearly_distribution"),
  });

  // Transform the data
  const expenseTable = transformColumnDataToRows(expenseTableRaw);
  const savingsTable = transformColumnDataToRows(savingsTableRaw);
  const yearlyDistTable = transformColumnDataToRows(yearlyDistTableRaw);

  const availableMetrics: string[] =
    monthlyTrends?.datasets?.map((d: any) => d.label) || [];

  const toggleMetric = (metric: string) => {
    setSelectedMetrics((prev) =>
      prev.includes(metric)
        ? prev.filter((m) => m !== metric)
        : [...prev, metric]
    );
  };

  // ================== TOTAL CALCULATIONS ==================
  const sumArray = (arr?: number[]) =>
    arr?.reduce((acc, v) => acc + (v || 0), 0) || 0;

  const portfolioTotal = sumArray(
    savingsPies?.portfolio_breakdown?.datasets?.[0]?.data
  );
  const retirementTotal = sumArray(
    savingsPies?.retirement_breakdown?.datasets?.[0]?.data
  );

  const getDatasetData = (datasets: any, index = 0): number[] => {
    if (Array.isArray(datasets) && datasets[index]) {
      return datasets[index].data || [];
    }
    return [];
  };

  const expenseTotal = sumArray(
    getDatasetData(expensePie?.datasets, 0)
  );

  const isTableLoading = 
    (activeTab === "expense" && expenseTableLoading) ||
    (activeTab === "savings" && savingsTableLoading) ||
    (activeTab === "yearly" && yearlyTableLoading);

  return (
    <div className="bg-gray-50 p-3">
      <div className="max-w-7xl mx-auto space-y-3">
        
        {/* Pie Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader
              title={`Expense Breakdown (${formatCurrency(expenseTotal)})`}
            />
            <CardBody>
              {expensePieLoading ? (
                <ChartSkeleton />
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={
                        expensePie?.labels?.map((label, i) => ({
                          name: label,
                          value:
                            getDatasetData(expensePie.datasets, 0)[i] ?? 0,
                        })) || []
                      }
                      dataKey="value"
                      nameKey="name"
                      innerRadius={50}
                      outerRadius={90}
                      paddingAngle={2}
                    >
                      {expensePie?.labels?.map((_, i) => (
                        <Cell
                          key={`cell-exp-${i}`}
                          fill={COLORS[i % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip total={expenseTotal} />} />
                    <Legend 
                      layout="horizontal" 
                      verticalAlign="bottom" 
                      align="center"
                      wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title={`Portfolio Breakdown (${formatCurrency(portfolioTotal)})`}
            />
            <CardBody>
              {savingsPiesLoading ? (
                <ChartSkeleton />
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={
                        savingsPies?.portfolio_breakdown?.datasets?.[0]?.data?.map(
                          (value: number, i: number) => ({
                            name:
                              savingsPies.portfolio_breakdown.labels[i],
                            value,
                          })
                        ) || []
                      }
                      dataKey="value"
                      nameKey="name"
                      innerRadius={50}
                      outerRadius={90}
                      paddingAngle={2}
                    >
                      {savingsPies?.portfolio_breakdown?.labels?.map(
                        (_: any, i: number) => (
                          <Cell
                            key={`cell-port-${i}`}
                            fill={COLORS[i % COLORS.length]}
                          />
                        )
                      )}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip total={portfolioTotal} />} />
                    <Legend 
                      layout="horizontal" 
                      verticalAlign="bottom" 
                      align="center"
                      wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title={`Retirement Breakdown (${formatCurrency(retirementTotal)})`}
            />
            <CardBody>
              {savingsPiesLoading ? (
                <ChartSkeleton />
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={
                        savingsPies?.retirement_breakdown?.datasets?.[0]?.data?.map(
                          (value: number, i: number) => ({
                            name:
                              savingsPies.retirement_breakdown.labels[i],
                            value,
                          })
                        ) || []
                      }
                      dataKey="value"
                      nameKey="name"
                      innerRadius={50}
                      outerRadius={90}
                      paddingAngle={2}
                    >
                      {savingsPies?.retirement_breakdown?.labels?.map(
                        (_: any, i: number) => (
                          <Cell
                            key={`cell-ret-${i}`}
                            fill={COLORS[i % COLORS.length]}
                          />
                        )
                      )}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip total={retirementTotal} />} />
                    <Legend 
                      layout="horizontal" 
                      verticalAlign="bottom" 
                      align="center"
                      wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Interactive Line Chart */}
        <Card>
          <CardHeader title="Financial Trends" />
          <CardBody>
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {availableMetrics.map((metric, idx) => (
                  <button
                    key={metric}
                    onClick={() => toggleMetric(metric)}
                    className={`px-3 py-1.5 text-sm rounded-md border transition-all ${
                      selectedMetrics.includes(metric)
                        ? "text-white border-transparent"
                        : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
                    }`}
                    style={selectedMetrics.includes(metric) ? { 
                      backgroundColor: COLORS[idx % COLORS.length] 
                    } : {}}
                  >
                    {metric}
                  </button>
                ))}
              </div>
            </div>

            {trendsLoading ? (
              <div className="animate-pulse h-[350px] bg-gray-100 rounded"></div>
            ) : (
              <ResponsiveContainer width="100%" height={350}>
                <LineChart
                  data={
                    monthlyTrends?.labels?.map((lbl, i) => {
                      const entry: any = { month: lbl };
                      monthlyTrends.datasets?.forEach((d: any) => {
                        entry[d.label] = d.data[i] ?? 0;
                      });
                      return entry;
                    }) || []
                  }
                  margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 11 }}
                    tickLine={{ stroke: '#E5E7EB' }}
                  />
                  <YAxis 
                    tickFormatter={formatCurrency}
                    tick={{ fontSize: 11 }}
                    tickLine={{ stroke: '#E5E7EB' }}
                    width={70}
                  />
                  <Tooltip
                    formatter={(v: number) => formatIndianCurrency(v)}
                    contentStyle={{ 
                      borderRadius: '8px', 
                      border: '1px solid #E5E7EB',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend 
                    wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                  />
                  {monthlyTrends?.datasets
                    ?.filter((d: any) => selectedMetrics.includes(d.label))
                    .map((d: any, idx: number) => (
                      <Line
                        key={d.label}
                        type="monotone"
                        dataKey={d.label}
                        stroke={COLORS[availableMetrics.indexOf(d.label) % COLORS.length]}
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                    ))}
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardBody>
        </Card>

        {/* Tabbed Tables */}
        <Card>
          <CardHeader title="Detailed Reports" />
          <CardBody>
            <div className="mb-4">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-6">
                  {[
                    { id: "expense", name: "Expense Summary" },
                    { id: "savings", name: "Savings Summary" },
                    { id: "yearly", name: "Yearly Distribution" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      {tab.name}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Table container */}
            <div className="overflow-x-auto overflow-y-auto max-h-[400px] rounded-lg border border-gray-200 bg-white">
              {isTableLoading ? (
                <div className="p-4">
                  <TableSkeleton />
                </div>
              ) : (
                <div className="inline-block min-w-full align-middle">
                  {activeTab === "expense" && <DataTable data={expenseTable} />}
                  {activeTab === "savings" && <DataTable data={savingsTable} />}
                  {activeTab === "yearly" && <DataTable data={yearlyDistTable} />}
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Portfolio;