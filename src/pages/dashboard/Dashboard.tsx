// src/pages/dashboard/Dashboard.tsx
import React from 'react';
import { Card, CardHeader, CardBody } from '../../components/ui';
import { 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  CurrencyDollarIcon,
  BanknotesIcon,
  CreditCardIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const metrics = [
  {
    id: 1,
    label: 'Total Net Worth',
    value: 2500000,
    currency: '₹',
    change: '+12.5%',
    isPositive: true,
    icon: CurrencyDollarIcon,
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    id: 2,
    label: 'Total Income',
    value: 85000,
    currency: '₹',
    change: '+8.2%',
    isPositive: true,
    icon: BanknotesIcon,
    bgColor: 'bg-green-50',
    iconColor: 'text-green-600',
  },
  {
    id: 3,
    label: 'Total Expenses',
    value: 42000,
    currency: '₹',
    change: '-3.1%',
    isPositive: false,
    icon: CreditCardIcon,
    bgColor: 'bg-red-50',
    iconColor: 'text-red-600',
  },
  {
    id: 4,
    label: 'Investment Value',
    value: 1200000,
    currency: '₹',
    change: '+15.7%',
    isPositive: true,
    icon: ChartBarIcon,
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome back! Here's your financial overview.
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Last updated</p>
          <p className="text-sm font-medium text-gray-900">
            {new Date().toLocaleDateString('en-IN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardBody className="p-6">
              {/* Icon and Label */}
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                  <metric.icon className={`h-6 w-6 ${metric.iconColor}`} />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                </div>
              </div>

              {/* Value */}
              <div className="mt-4">
                <div className="flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900">
                    {metric.currency}{metric.value.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              {/* Change Indicator */}
              <div className="mt-4 flex items-center">
                <div className={`flex items-center ${
                  metric.isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.isPositive ? (
                    <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
                  )}
                  <span className="text-sm font-medium">{metric.change}</span>
                </div>
                <span className="ml-2 text-sm text-gray-500">from last month</span>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader 
            title="Quick Actions" 
            subtitle="Common tasks"
          />
          <CardBody className="space-y-3">
            <button className="w-full text-left p-3 rounded-lg bg-primary-50 hover:bg-primary-100 transition-colors">
              <span className="text-primary-700 font-medium">Add Transaction</span>
              <p className="text-sm text-primary-600">Record a new income or expense</p>
            </button>
            <button className="w-full text-left p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <span className="text-gray-700 font-medium">Upload Data</span>
              <p className="text-sm text-gray-600">Import from Excel or CSV</p>
            </button>
            <button className="w-full text-left p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <span className="text-gray-700 font-medium">View Reports</span>
              <p className="text-sm text-gray-600">Generate financial reports</p>
            </button>
          </CardBody>
        </Card>

        <Card>
          <CardHeader 
            title="Recent Activity" 
            subtitle="Latest transactions"
          />
          <CardBody>
            <div className="text-center py-8 text-gray-500">
              <p>No recent transactions</p>
              <p className="text-sm">Add some transactions to see them here</p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;