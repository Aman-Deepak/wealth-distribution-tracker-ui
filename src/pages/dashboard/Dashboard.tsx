// src/pages/dashboard/Dashboard.tsx
import React from 'react';
import { useQueries } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { summaryAPI, chartsAPI } from '../../services/api';
import { Card, CardHeader, CardBody } from '../../components/ui';
import {
  ArrowTrendingUpIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  BanknotesIcon,
  PresentationChartLineIcon,
  ShieldCheckIcon,
  CalendarDaysIcon,
  ArrowUpIcon,
  ArrowDownIcon,
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

// Loading skeleton for metric cards
const MetricCardSkeleton = () => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 animate-pulse">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
        <div className="h-8 bg-gray-200 rounded w-32 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-28"></div>
      </div>
      <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
    </div>
  </div>
);

// Loading skeleton for charts
const ChartSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
    <div className="h-80 bg-gray-100 rounded flex items-center justify-center">
      <div className="w-40 h-40 bg-gray-200 rounded-full"></div>
    </div>
  </div>
);

// Format currency for Indian locale
const formatCurrency = (value: number): string => {
  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(2)}Cr`;
  } else if (value >= 100000) {
    return `₹${(value / 100000).toFixed(2)}L`;
  } else if (value >= 1000) {
    return `₹${(value / 1000).toFixed(1)}K`;
  }
  return `₹${value.toFixed(0)}`;
};

const formatIndianCurrency = (value: number): string => {
  return `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
};

// Custom tooltip for charts
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-4 py-3 shadow-lg rounded-lg border border-gray-200">
        <p className="font-medium text-gray-900 mb-2">{payload[0].name}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm text-gray-600">
            <span className="font-medium">{entry.dataKey}:</span> {formatIndianCurrency(entry.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

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

  const isLoading = sumQ.isLoading || insQ.isLoading;
  const isChartsLoading = investBreakdownQ.isLoading || expenseFiscalQ.isLoading;

  const summary = sumQ.data;
  const insights = insQ.data;
  const investBreakdown = investBreakdownQ.data;
  const expenseFiscal = expenseFiscalQ.data;

  // Parse values safely
  const parseValue = (value?: string) => parseFloat(value?.replace(/[^0-9.-]/g, '') || '0') || 0;
  
  const totalInvested = parseValue(summary?.TOTAL_INVESTED);
  const totalValue = parseValue(summary?.TOTAL_VALUE);
  const bankBalance = parseValue(summary?.BANK_BALANCE);
  const netWorth = totalValue;
  const totalInvestWithoutBank = totalValue - bankBalance;
  const avg_monthly_exp = parseValue(summary?.AVG_MONTHLY_EXPENSE);
  const liquidWealth = parseValue(summary?.LIQUID_WEALTH);
  const totalPnl = parseValue(summary?.TOTAL_PNL);
  const profitBooked = parseValue(summary?.PROFIT_BOOKED_SUM);
  const totalLoans = parseValue(summary?.TOTAL_LOANS);

  // Extract return percentage if available
  const weightedReturn = summary?.WEIGHTED_RETURN?.replace(/[^0-9.-]/g, '') || '0';
  const returnValue = parseFloat(weightedReturn);
  const isPositiveReturn = returnValue >= 0;

  const MetricCard = ({ 
    title, 
    value, 
    subValue,
    change, 
    icon: Icon, 
    color,
    bgColor,
    description,
    onClick,
    trend
  }: {
    title: string;
    value: string;
    subValue?: string;
    change?: string;
    icon: any;
    color: string;
    bgColor: string;
    description?: string;
    onClick?: () => void;
    trend?: 'up' | 'down' | 'neutral';
  }) => (
    <div 
      className={`bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer group ${onClick ? 'hover:border-blue-300' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subValue && (
            <p className="text-sm text-gray-500 mt-1">{subValue}</p>
          )}
        </div>
        <div className={`${bgColor} p-3 rounded-xl group-hover:scale-110 transition-transform`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
      </div>
      
      {description && (
        <p className="text-xs text-gray-500 mb-2">{description}</p>
      )}
      
      {change && (
        <div className="flex items-center space-x-1">
          {trend === 'up' && <ArrowUpIcon className="h-4 w-4 text-green-600" />}
          {trend === 'down' && <ArrowDownIcon className="h-4 w-4 text-red-600" />}
          <span className={`text-sm font-medium ${
            trend === 'up' ? 'text-green-600' : 
            trend === 'down' ? 'text-red-600' : 
            'text-gray-600'
          }`}>
            {change}
          </span>
        </div>
      )}
    </div>
  );

  const QuickActionButton = ({ 
    title, 
    icon, 
    color, 
    route 
  }: { 
    title: string; 
    icon: string; 
    color: string; 
    route: string; 
  }) => (
    <button
      onClick={() => navigate(route)}
      className={`${color} text-white rounded-xl p-6 hover:shadow-lg transition-all duration-200 group relative overflow-hidden`}
    >
      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
      <div className="relative text-center">
        <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <p className="font-semibold text-sm">{title}</p>
      </div>
    </button>
  );

  // Color mapping for consistent chart colors
  const colorMap: Record<string, string> = {};
  const getColor = (key: string) => {
    if (!colorMap[key]) {
      colorMap[key] = COLORS[Object.keys(colorMap).length % COLORS.length];
    }
    return colorMap[key];
  };

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-70px)] overflow-auto bg-gray-50 p-3">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="text-center mb-6">
            <div className="h-10 bg-gray-200 rounded w-64 mx-auto mb-2 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <MetricCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Net Worth"
            value={formatCurrency(netWorth)}
            subValue={formatIndianCurrency(netWorth)}
            icon={CurrencyDollarIcon}
            color="text-blue-600"
            bgColor="bg-blue-50"
            description="Your total financial worth"
            onClick={() => navigate('/portfolio')}
          />
          
          <MetricCard
            title="Total Investment"
            value={formatCurrency(totalInvestWithoutBank)}
            subValue={formatIndianCurrency(totalInvestWithoutBank)}
            icon={PresentationChartLineIcon}
            color="text-purple-600"
            bgColor="bg-purple-50"
            description="Investment portfolio value"
            onClick={() => navigate('/portfolio')}
          />
          
          <MetricCard
            title="Bank Balance"
            value={formatCurrency(bankBalance)}
            subValue={formatIndianCurrency(bankBalance)}
            icon={ShieldCheckIcon}
            color="text-teal-600"
            bgColor="bg-teal-50"
            description="Available cash reserves"
            onClick={() => navigate('/transactions')}
          />
          
          <MetricCard
            title="Monthly Expenses"
            value={formatCurrency(avg_monthly_exp)}
            subValue={formatIndianCurrency(avg_monthly_exp)}
            icon={CalendarDaysIcon}
            color="text-red-600"
            bgColor="bg-red-50"
            description="Avg monthly spending (last 12 months)"
            onClick={() => navigate('/transactions')}
          />
          
          <MetricCard
            title="Liquid Assets"
            value={formatCurrency(liquidWealth)}
            subValue={formatIndianCurrency(liquidWealth)}
            icon={BanknotesIcon}
            color="text-emerald-600"
            bgColor="bg-emerald-50"
            description="Accessible within 1-2 days"
            onClick={() => navigate('/portfolio')}
          />
          
          <MetricCard
            title="Portfolio Return"
            value={formatCurrency(totalPnl)}
            subValue={formatIndianCurrency(totalPnl)}
            change={summary?.WEIGHTED_RETURN || '0%'}
            icon={ArrowTrendingUpIcon}
            color="text-indigo-600"
            bgColor="bg-indigo-50"
            description="Unrealized gains"
            trend={isPositiveReturn ? 'up' : 'down'}
            onClick={() => navigate('/portfolio')}
          />
          
          <MetricCard
            title="Profit Booked"
            value={formatCurrency(profitBooked)}
            subValue={formatIndianCurrency(profitBooked)}
            icon={ArrowTrendingUpIcon}
            color="text-green-600"
            bgColor="bg-green-50"
            description="Realized investment gains"
          />
          
          <MetricCard
            title="Outstanding Loans"
            value={formatCurrency(totalLoans)}
            subValue={formatIndianCurrency(totalLoans)}
            icon={ChartBarIcon}
            color="text-orange-600"
            bgColor="bg-orange-50"
            description="Remaining loan liabilities"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Investment Breakdown */}
          <Card>
            <CardHeader title="Investment Breakdown" />
            <CardBody>
              {isChartsLoading ? (
                <ChartSkeleton />
              ) : (
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie
                      data={
                        (investBreakdown as any)?.invest_breakdown?.datasets?.[0]?.data?.map(
                          (value: number, i: number) => ({
                            name: (investBreakdown as any).invest_breakdown.labels[i],
                            value,
                          })
                        ) || []
                      }
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={110}
                      paddingAngle={3}
                      dataKey="value"
                      nameKey="name"
                    >
                      {(investBreakdown as any)?.invest_breakdown?.labels?.map(
                        (label: string) => (
                          <Cell key={label} fill={getColor(label)} />
                        )
                      )}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                      layout="horizontal" 
                      verticalAlign="bottom" 
                      align="center"
                      wrapperStyle={{ fontSize: '12px', paddingTop: '15px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardBody>
          </Card>

          {/* Expense Fiscal Stack */}
          <Card>
            <CardHeader title="Expenses by Year & Type" />
            <CardBody>
              {isChartsLoading ? (
                <ChartSkeleton />
              ) : (
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart 
                    data={expenseFiscal?.labels?.map((year: string, i: number) => {
                      const entry: any = { year };
                      expenseFiscal.datasets?.forEach((d: any) => {
                        entry[d.label] = d.data[i] ?? 0;
                      });
                      return entry;
                    }) || []}
                    margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis 
                      dataKey="year" 
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
                      content={<CustomTooltip />}
                      contentStyle={{ 
                        borderRadius: '8px', 
                        border: '1px solid #E5E7EB',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    {expenseFiscal?.datasets?.map((d: any, idx: number) => (
                      <Bar 
                        key={d.label} 
                        dataKey={d.label} 
                        fill={COLORS[idx % COLORS.length]}
                        radius={[4, 4, 0, 0]}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader title="Quick Actions" />
          <CardBody>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <QuickActionButton
                title="Add Transaction"
                icon="💰"
                color="bg-gradient-to-br from-blue-600 to-blue-700"
                route="/transactions"
              />
              <QuickActionButton
                title="Upload Data"
                icon="📁"
                color="bg-gradient-to-br from-green-600 to-green-700"
                route="/upload"
              />
              <QuickActionButton
                title="Generate Report"
                icon="📊"
                color="bg-gradient-to-br from-purple-600 to-purple-700"
                route="/reports"
              />
              <QuickActionButton
                title="View Portfolio"
                icon="📈"
                color="bg-gradient-to-br from-orange-600 to-orange-700"
                route="/portfolio"
              />
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;