// src/pages/portfolio/Portfolio.tsx
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { chartsAPI, tablesAPI } from "../../services/api";
import { Card, CardHeader, CardBody } from "../../components/ui";
import { ChartResponse, TableResponse } from '../../types';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from "recharts";

// Define the expected structure of dataset items
interface Dataset {
  label?: string;
  data: number[];
}

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#14B8A6"];

const Portfolio: React.FC = () => {
  // Fetch chart data
  const { data: expensePie, isLoading: expensePieLoading } = useQuery<ChartResponse>({
    queryKey: ['expensePie'],
    queryFn: () => chartsAPI.getChartData('expense_type_pie'),
  });

  const { data: expenseTrend, isLoading: expenseTrendLoading } = useQuery<ChartResponse>({
    queryKey: ['expenseTrend'],
    queryFn: () => chartsAPI.getChartData('expense_monthly_trend'),
  });

  const { data: investTrend, isLoading: investTrendLoading } = useQuery<ChartResponse>({
    queryKey: ['investTrend'],
    queryFn: () => chartsAPI.getChartData('invest_monthly_trend'),
  });

  const { data: monthlyTrends, isLoading: monthlyTrendsLoading } = useQuery<ChartResponse>({
    queryKey: ['monthlyTrends'],
    queryFn: () => chartsAPI.getChartData('financial_monthly_trends'),
  });

  // Fetch table data
  const { data: expenseTable, isLoading: expenseTableLoading } = useQuery<TableResponse>({
    queryKey: ['expenseTable'],
    queryFn: () => tablesAPI.getTableData('expense_summary'),
  });

  const { data: savingsTable, isLoading: savingsTableLoading } = useQuery<TableResponse>({
    queryKey: ['savingsTable'],
    queryFn: () => tablesAPI.getTableData('savings_summary'),
  });

  const { data: yearlyDistTable, isLoading: yearlyDistTableLoading } = useQuery<TableResponse>({
    queryKey: ['yearlyDistTable'],
    queryFn: () => tablesAPI.getTableData('yearly_distribution'),
  });

  // Loading state
  const isLoading = expensePieLoading || expenseTrendLoading || investTrendLoading || 
                   monthlyTrendsLoading || expenseTableLoading || savingsTableLoading || 
                   yearlyDistTableLoading;

  // Helper function to safely get dataset data
  const getDatasetData = (datasets: any[] | Record<string, any>, index: number = 0): number[] => {
    if (Array.isArray(datasets) && datasets[index]) {
      return (datasets[index] as Dataset).data || [];
    }
    return [];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading portfolio data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-6">Portfolio Overview</h1>

      {/* First row of charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader title="Expense Distribution by Type" />
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expensePie?.labels?.map((label: string, i: number) => ({
                    name: label,
                    value: getDatasetData(expensePie.datasets, 0)[i] ?? 0,
                  })) || []}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                >
                  {expensePie?.labels?.map((_, i: number) => (
                    <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                  )) || []}
                </Pie>
                <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Expense Monthly Trend" />
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={expenseTrend?.labels?.map((lbl: string, i: number) => ({
                  month: lbl,
                  expense: getDatasetData(expenseTrend.datasets, 0)[i] ?? 0,
                })) || []}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
                <Line type="monotone" dataKey="expense" stroke={COLORS[3]} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      {/* Second row of charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader title="Investment Monthly Trend" />
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={investTrend?.labels?.map((lbl: string, i: number) => ({
                  month: lbl,
                  buy: getDatasetData(investTrend.datasets, 0)[i] ?? 0,
                  sell: getDatasetData(investTrend.datasets, 1)[i] ?? 0,
                })) || []}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
                <Bar dataKey="buy" fill={COLORS[1]} />
                <Bar dataKey="sell" fill={COLORS[4]} />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card>
            <CardHeader title="Financial Monthly Trends" />
            <CardBody>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                        data={monthlyTrends?.labels?.map((lbl: string, i: number) => {
                        const entry: Record<string, number | string> = { month: lbl };
                        if (Array.isArray(monthlyTrends.datasets)) {
                            monthlyTrends.datasets.forEach((d: Dataset, idx: number) => {
                                const label = d.label || `Dataset ${idx}`;
                                entry[label] = d.data[i] ?? 0;
                            });
                        }
                        return entry;
                    }) || []}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
                <Legend verticalAlign="bottom" height={36} />
                {monthlyTrends && Array.isArray(monthlyTrends.datasets) && monthlyTrends.datasets.map((d: Dataset, idx: number) => (
                <Bar key={d.label || idx} dataKey={d.label || `Dataset ${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
            </BarChart>
            </ResponsiveContainer>
        </CardBody>
        </Card>

      </div>

      {/* Tables */}
      <div className="space-y-8">
        <Card>
          <CardHeader title="Expense Summary" />
          <CardBody>
            <div
              className="prose max-w-full overflow-auto"
              dangerouslySetInnerHTML={{ __html: expenseTable?.html || '' }}
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Savings Summary" />
          <CardBody>
            <div
              className="prose max-w-full overflow-auto"
              dangerouslySetInnerHTML={{ __html: savingsTable?.html || '' }}
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Yearly Distribution" />
          <CardBody>
            <div
              className="prose max-w-full overflow-auto"
              dangerouslySetInnerHTML={{ __html: yearlyDistTable?.html || '' }}
            />
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Portfolio;
