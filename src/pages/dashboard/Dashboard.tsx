// src/pages/dashboard/Dashboard.tsx
import React from 'react';
import { useQueries } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { summaryAPI, chartsAPI } from '../../services/api';
import { Card, CardHeader, CardBody, Button } from '../../components/ui';
import {
  ArrowTrendingUpIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  BanknotesIcon,
  PresentationChartLineIcon,
  ShieldCheckIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline';
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
} from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#14B8A6'];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const [sumQ, insQ, investBreakdownQ, expenseFiscalQ] = useQueries({
    queries: [
      { queryKey: ['dashboardSummary'], queryFn: () => summaryAPI.getDashboardSummary() },
      { queryKey: ['dashboardInsights'], queryFn: () => summaryAPI.getDashboardInsights() },
      { queryKey: ['investBreakdown'], queryFn: () => chartsAPI.getChartData('savings_pie') },
      { queryKey: ['expenseFiscal'], queryFn: () => chartsAPI.getChartData('expense_fiscal_stack') },
    ],
  });

  if (sumQ.isLoading || insQ.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading financial insights...</p>
        </div>
      </div>
    );
  }

  const summary = sumQ.data;
  const insights = insQ.data;
  const investBreakdown = investBreakdownQ.data;
  const expenseFiscal = expenseFiscalQ.data;

  // Fix parseValue to handle undefined
  const parseValue = (value?: string) => parseFloat(value?.replace(/[^0-9.-]/g, '') || '0') || 0;
  
  const totalInvested = parseValue(summary?.TOTAL_INVESTED);
  const totalValue = parseValue(summary?.TOTAL_VALUE);
  const bankBalance = parseValue(summary?.BANK_BALANCE);
  const netWorth = totalValue; // Renamed from TOTAL_WEALTH
  const totalInvestWithoutBank = totalValue - bankBalance; // Investment without bank balance

  const MetricCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    gradient,
    description,
    onClick 
  }: {
    title: string;
    value: string;
    change?: string;
    icon: any;
    gradient: string;
    description?: string;
    onClick?: () => void;
  }) => (
    <div 
      className={`${gradient} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-white/80 text-sm font-medium mb-2">{title}</p>
          <p className="text-3xl font-bold mb-1">{value}</p>
          {description && (
            <p className="text-white/70 text-xs">{description}</p>
          )}
          {change && (
            <div className="flex items-center mt-2">
              <span className="text-white/90 text-sm font-medium">{change}</span>
            </div>
          )}
        </div>
        <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm group-hover:bg-white/30 transition-colors">
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Financial Dashboard
          </h1>
          <p className="text-gray-600 text-lg">Your comprehensive wealth management overview</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Net Worth"
            value={`₹${netWorth.toLocaleString()}`}
            change={insights?.PORTFOLIO_RETURN}
            icon={CurrencyDollarIcon}
            gradient="bg-gradient-to-br from-blue-600 to-blue-700"
            description="Your total financial worth"
            onClick={() => navigate('/portfolio')}
          />
          <MetricCard
            title="Total Investment"
            value={`₹${totalInvestWithoutBank.toLocaleString()}`}
            change={`+${((totalValue - totalInvested) / totalInvested * 100).toFixed(1)}%`}
            icon={PresentationChartLineIcon}
            gradient="bg-gradient-to-br from-purple-600 to-purple-700"
            description="Investment portfolio value"
            onClick={() => navigate('/portfolio')}
          />
          <MetricCard
            title="Bank Balance"
            value={`₹${bankBalance.toLocaleString()}`}
            icon={ShieldCheckIcon}
            gradient="bg-gradient-to-br from-teal-600 to-teal-700"
            description="Available cash reserves"
            onClick={() => navigate('/transactions')}
          />
          <MetricCard
            title="Monthly Expenses"
            value={`₹${parseValue(summary?.TOTAL_EXPENSES).toLocaleString()}`}
            icon={CalendarDaysIcon}
            gradient="bg-gradient-to-br from-red-500 to-red-600"
            description="Current month spending"
            onClick={() => navigate('/transactions')}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Investment Breakdown */}
          <Card>
            <CardHeader title="Investment Breakdown" />
            <CardBody>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={(investBreakdown as any)?.invest_breakdown?.datasets?.[0]?.data?.map((value: number, i: number) => ({
                        name: (investBreakdown as any).invest_breakdown.labels[i],
                        value: value,
                        fill: COLORS[i % COLORS.length]
                      })) || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {(investBreakdown as any)?.invest_breakdown?.labels?.map((_: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Amount']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardBody>
          </Card>

          {/* Expense Fiscal Stack */}
          <Card>
            <CardHeader title="Expense by Year & Type" />
            <CardBody>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={expenseFiscal?.labels?.map((year: string, i: number) => {
                    const entry: any = { year };
                    expenseFiscal.datasets?.forEach((d: any) => {
                      entry[d.label] = d.data[i] ?? 0;
                    });
                    return entry;
                  }) || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="year" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Amount']} />
                    <Legend />
                    {expenseFiscal?.datasets?.map((d: any, idx: number) => (
                      <Bar key={d.label} dataKey={d.label} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader title="Quick Actions" />
          <CardBody>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { title: 'Add Transaction', icon: '💰', color: 'bg-blue-500', route: '/transactions' },
                { title: 'Upload Data', icon: '📁', color: 'bg-green-500', route: '/upload' },
                { title: 'Generate Report', icon: '📊', color: 'bg-purple-500', route: '/reports' },
                { title: 'View Portfolio', icon: '📈', color: 'bg-orange-500', route: '/portfolio' },
              ].map((action, index) => (
                <button
                  key={index}
                  onClick={() => navigate(action.route)}
                  className={`${action.color} text-white rounded-xl p-4 hover:shadow-lg transition-all duration-200 group h-20`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">
                      {action.icon}
                    </div>
                    <p className="font-medium text-sm">{action.title}</p>
                  </div>
                </button>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
