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
  LineChart,
  Line,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar,
} from 'recharts';

const COLORS = {
  primary: ['#3B82F6', '#1D4ED8', '#1E40AF'],
  success: ['#10B981', '#059669', '#047857'],
  warning: ['#F59E0B', '#D97706', '#B45309'],
  danger: ['#EF4444', '#DC2626', '#B91C1C'],
  purple: ['#8B5CF6', '#7C3AED', '#6D28D9'],
  teal: ['#14B8A6', '#0D9488', '#0F766E'],
};

const Dashboard: React.FC = () => {
  const [sumQ, insQ] = useQueries({
    queries: [
      { queryKey: ['dashboardSummary'], queryFn: () => summaryAPI.getDashboardSummary() },
      { queryKey: ['dashboardInsights'], queryFn: () => summaryAPI.getDashboardInsights() },
    ],
  });

  if (sumQ.isLoading || insQ.isLoading || !sumQ.data || !insQ.data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your financial insights...</p>
        </div>
      </div>
    );
  }

  const summary = sumQ.data as DashboardSummary;
  const insights = insQ.data as DashboardInsights;

  // Parse numeric values from summary strings
  const parseValue = (value: string) => parseFloat(value.replace(/[^0-9.-]/g, '')) || 0;
  
  const totalWealth = parseValue(summary.TOTAL_WEALTH);
  const liquidWealth = parseValue(summary.LIQUID_WEALTH);
  const totalInvested = parseValue(summary.TOTAL_INVESTED);
  const totalValue = parseValue(summary.TOTAL_VALUE);
  const bankBalance = parseValue(summary.BANK_BALANCE);
  const totalExpenses = parseValue(summary.TOTAL_EXPENSES);

  // Chart data
  const wealthDistribution = [
    { name: 'Investments', value: totalValue, fill: COLORS.primary[0] },
    { name: 'Bank Balance', value: bankBalance, fill: COLORS.success[0] },
    { name: 'Liquid Assets', value: liquidWealth - bankBalance, fill: COLORS.warning[0] },
  ];

  const performanceData = [
    { month: 'Jan', invested: totalInvested * 0.8, returns: totalValue * 0.75 },
    { month: 'Feb', invested: totalInvested * 0.85, returns: totalValue * 0.82 },
    { month: 'Mar', invested: totalInvested * 0.9, returns: totalValue * 0.88 },
    { month: 'Apr', invested: totalInvested * 0.95, returns: totalValue * 0.94 },
    { month: 'May', invested: totalInvested, returns: totalValue },
  ];

  const goalProgress = [
    { name: 'Emergency Fund', progress: 85, target: 100000, current: 85000, fill: COLORS.success[0] },
    { name: 'Retirement', progress: 45, target: 2000000, current: 900000, fill: COLORS.primary[0] },
    { name: 'House Down Payment', progress: 65, target: 500000, current: 325000, fill: COLORS.warning[0] },
  ];

  const MetricCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    gradient,
    description 
  }: {
    title: string;
    value: string;
    change?: string;
    icon: any;
    gradient: string;
    description?: string;
  }) => (
    <div className={`${gradient} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 group`}>
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

  const InsightCard = ({ 
    title, 
    value, 
    trend, 
    icon: Icon, 
    color 
  }: {
    title: string;
    value: string;
    trend: 'up' | 'down' | 'neutral';
    icon: any;
    color: string;
  }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className={`p-3 ${color} rounded-lg`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <div className="flex items-center justify-end mt-1">
            {trend === 'up' && <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />}
            {trend === 'down' && <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />}
            <span className={`text-xs font-medium ${trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-500'}`}>
              {trend === 'up' ? 'Improving' : trend === 'down' ? 'Declining' : 'Stable'}
            </span>
          </div>
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
            title="Total Wealth"
            value={`₹${totalWealth.toLocaleString()}`}
            change={insights.PORTFOLIO_RETURN}
            icon={CurrencyDollarIcon}
            gradient="bg-gradient-to-br from-blue-600 to-blue-700"
            description="Your complete financial worth"
          />
          <MetricCard
            title="Liquid Wealth"
            value={`₹${liquidWealth.toLocaleString()}`}
            icon={BanknotesIcon}
            gradient="bg-gradient-to-br from-green-600 to-green-700"
            description="Readily available funds"
          />
          <MetricCard
            title="Investment Value"
            value={`₹${totalValue.toLocaleString()}`}
            change={`+${((totalValue - totalInvested) / totalInvested * 100).toFixed(1)}%`}
            icon={PresentationChartLineIcon}
            gradient="bg-gradient-to-br from-purple-600 to-purple-700"
            description="Current investment portfolio"
          />
          <MetricCard
            title="Bank Balance"
            value={`₹${bankBalance.toLocaleString()}`}
            icon={ShieldCheckIcon}
            gradient="bg-gradient-to-br from-teal-600 to-teal-700"
            description="Available cash reserves"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Wealth Distribution */}
          <Card>
            <CardHeader title="Wealth Distribution" />
            <CardBody>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={wealthDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {wealthDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Amount']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardBody>
          </Card>

          {/* Investment Performance */}
          <Card>
            <CardHeader title="Investment Performance Trend" />
            <CardBody>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData}>
                    <defs>
                      <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.primary[0]} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={COLORS.primary[0]} stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorReturns" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.success[0]} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={COLORS.success[0]} stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Amount']} />
                    <Area
                      type="monotone"
                      dataKey="invested"
                      stroke={COLORS.primary[0]}
                      fillOpacity={1}
                      fill="url(#colorInvested)"
                      name="Invested"
                    />
                    <Area
                      type="monotone"
                      dataKey="returns"
                      stroke={COLORS.success[0]}
                      fillOpacity={1}
                      fill="url(#colorReturns)"
                      name="Current Value"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Financial Goals Progress */}
        <Card>
          <CardHeader title="Financial Goals Progress" />
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {goalProgress.map((goal, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">{goal.name}</h3>
                    <span className="text-sm font-medium text-gray-600">{goal.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                    <div 
                      className="h-3 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${goal.progress}%`,
                        background: `linear-gradient(90deg, ${goal.fill}, ${goal.fill}dd)`
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>₹{goal.current.toLocaleString()}</span>
                    <span>₹{goal.target.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Key Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <InsightCard
            title="Portfolio Return"
            value={insights.PORTFOLIO_RETURN}
            trend="up"
            icon={ArrowTrendingUpIcon}
            color="bg-green-500"
          />
          <InsightCard
            title="Top Performing Asset"
            value={insights.TOP_ASSET}
            trend="up"
            icon={ChartBarIcon}
            color="bg-blue-500"
          />
          <InsightCard
            title="Highest Expense Category"
            value={insights.HIGHEST_CATEGORY}
            trend="neutral"
            icon={CurrencyDollarIcon}
            color="bg-orange-500"
          />
          <InsightCard
            title="YoY Expense Change"
            value={insights.YOY_EXPENSE}
            trend={insights.YOY_EXPENSE.includes('-') ? 'down' : 'up'}
            icon={CalendarDaysIcon}
            color="bg-purple-500"
          />
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader title="Quick Actions" />
          <CardBody>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { title: 'Add Transaction', icon: '💰', color: 'bg-blue-500' },
                { title: 'Upload Data', icon: '📁', color: 'bg-green-500' },
                { title: 'Generate Report', icon: '📊', color: 'bg-purple-500' },
                { title: 'View Analytics', icon: '📈', color: 'bg-orange-500' },
              ].map((action, index) => (
                <button
                  key={index}
                  className={`${action.color} text-white rounded-xl p-4 hover:shadow-lg transition-all duration-200 group`}
                >
                  <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                    {action.icon}
                  </div>
                  <p className="font-medium text-sm">{action.title}</p>
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
