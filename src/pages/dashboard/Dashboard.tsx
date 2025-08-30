// src/pages/dashboard/Dashboard.tsx
import React from 'react';
import { useQueries } from '@tanstack/react-query';
import { summaryAPI } from '../../services/api';
import { Card, CardHeader, CardBody } from '../../components/ui';
import {
  DashboardSummary,
  DashboardInsights,
} from '../../types';
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from 'recharts';

const COLORS = {
  blue: ['#DBEAFE', '#1D4ED8'],
  green: ['#D1FAE5', '#059669'],
  red: ['#FEE2E2', '#DC2626'],
  purple: ['#EDE9FE', '#7C3AED'],
};

const Dashboard: React.FC = () => {
  const [sumQ, insQ] = useQueries({
    queries: [
      { queryKey: ['dashboardSummary'], queryFn: () => summaryAPI.getDashboardSummary() },
      { queryKey: ['dashboardInsights'], queryFn: () => summaryAPI.getDashboardInsights() },
    ],
  });

  if (sumQ.isLoading || insQ.isLoading || !sumQ.data || !insQ.data) {
    return <div className="animate-pulse p-8">Loading…</div>;
  }

  const summary = sumQ.data as DashboardSummary;
  const insights = insQ.data as DashboardInsights;

  // Data for Charts
  const barData = [
    { name: 'Income', value: parseFloat(summary.TOTAL_INVESTED.replace(/[^\d.]/g, '')) },
    { name: 'Expenses', value: parseFloat(summary.TOTAL_EXPENSES.replace(/[^\d.]/g, '')) },
  ];
  const pieData = [
    { name: 'Invested', value: parseFloat(summary.TOTAL_VALUE.replace(/[^\d.]/g, '')) },
    { name: 'Bank', value: parseFloat(summary.BANK_BALANCE.replace(/[^\d.]/g, '')) },
  ];
  const radarData = [
    { subject: 'YoY Expense', A: parseFloat(insights.YOY_EXPENSE.replace('%','')) },
    { subject: 'YoY Invest', A: parseFloat(insights.YOY_INVEST.replace('%','')) },
    { subject: 'Port. Return', A: parseFloat(insights.PORTFOLIO_RETURN.replace('%','')) },
  ];

  return (
    <div className="space-y-8 p-8">
      {/* Hero */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold">Welcome Back!</h1>
          <p className="text-gray-600">Your financial dashboard</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full lg:w-auto">
          <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
            <CardBody>
              <p className="uppercase text-xs">Net Worth</p>
              <p className="text-2xl font-semibold mt-1">{summary.TOTAL_WEALTH}</p>
            </CardBody>
          </Card>
          <Card className="bg-gradient-to-r from-green-500 to-teal-600 text-white">
            <CardBody>
              <p className="uppercase text-xs">Liquid Wealth</p>
              <p className="text-2xl font-semibold mt-1">{summary.LIQUID_WEALTH}</p>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader title="Income vs Expenses" />
          <CardBody>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={barData}>
                <XAxis dataKey="name" />
                <Tooltip />
                <Bar dataKey="value" fill="#1D4ED8" />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Portfolio Allocation" />
          <CardBody>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} dataKey="value" innerRadius={40} outerRadius={80} label>
                  {pieData.map((entry, idx) => (
                    <Cell key={idx} fill={[COLORS.purple[1], COLORS.blue[1]][idx]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Growth Insights" />
          <CardBody>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <Radar name="Growth" dataKey="A" stroke="#7C3AED" fill="#8B5CF6" fillOpacity={0.6} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      {/* Insights */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Highlights</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: CurrencyDollarIcon, label: 'Highest Category', value: insights.HIGHEST_CATEGORY },
            { icon: ChartBarIcon, label: 'Top Asset', value: insights.TOP_ASSET },
            { icon: ArrowTrendingUpIcon, label: 'Portfolio Return', value: insights.PORTFOLIO_RETURN },
            { icon: ArrowTrendingDownIcon, label: 'YoY Expense', value: insights.YOY_EXPENSE },
          ].map(({ icon: Icon, label, value }) => (
            <Card key={label} className="hover:shadow-lg">
              <CardBody className="flex items-center gap-4">
                <Icon className="h-6 w-6 text-indigo-500" />
                <div>
                  <p className="text-xs text-gray-500">{label}</p>
                  <p className="font-semibold">{value}</p>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
