// src/pages/transactions/Transactions.tsx - Fixed TypeScript Set issue
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardBody, Input, Button } from '../../components/ui';
import { incomeAPI, expenseAPI, investmentAPI, loanAPI } from '../../services/api';
import { Income, Expense, Investment, Loan } from '../../types';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';

type TransactionType = 'all' | 'income' | 'expense' | 'investment' | 'loan';
type CombinedTransaction = {
  id: number;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: 'income' | 'expense' | 'investment' | 'loan';
  details?: any;
};

const Transactions: React.FC = () => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<TransactionType>('all');
  const [yearFilter, setYearFilter] = useState('');
  const [monthFilter, setMonthFilter] = useState('');

  // Fetch data from all transaction types
  const { data: incomes, isLoading: incomeLoading } = useQuery({
    queryKey: ['incomes', yearFilter, monthFilter],
    queryFn: () => incomeAPI.getIncome({ 
      skip: 0, 
      limit: 100,
      ...(yearFilter && { year: yearFilter }),
      ...(monthFilter && { month: monthFilter })
    }),
  });

  const { data: expenses, isLoading: expenseLoading } = useQuery({
    queryKey: ['expenses', yearFilter, monthFilter],
    queryFn: () => expenseAPI.getExpenses({ 
      skip: 0, 
      limit: 100,
      ...(yearFilter && { year: yearFilter }),
      ...(monthFilter && { month: monthFilter })
    }),
  });

  const { data: investments, isLoading: investmentLoading } = useQuery({
    queryKey: ['investments', yearFilter, monthFilter],
    queryFn: () => investmentAPI.getInvestments({ 
      skip: 0, 
      limit: 100,
      ...(yearFilter && { year: yearFilter }),
      ...(monthFilter && { month: monthFilter })
    }),
  });

  const { data: loans, isLoading: loanLoading } = useQuery({
    queryKey: ['loans', yearFilter, monthFilter],
    queryFn: () => loanAPI.getLoans({ 
      ...(yearFilter && { year: yearFilter }),
      ...(monthFilter && { month: monthFilter })
    }),
  });

  // Combine and normalize all transactions
  const combineTransactions = (): CombinedTransaction[] => {
    const combined: CombinedTransaction[] = [];

    // Add incomes
    if (incomes) {
      incomes.forEach((income: Income) => {
        combined.push({
          id: income.id || 0,
          date: `${income.year}-${income.month.padStart(2, '0')}-${income.day.padStart(2, '0')}`,
          description: 'Salary',
          category: 'Income',
          amount: Number(income.salary) || 0,
          type: 'income',
          details: income
        });
      });
    }

    // Add expenses
    if (expenses) {
      expenses.forEach((expense: Expense) => {
        combined.push({
          id: expense.id || 0,
          date: `${expense.year}-${expense.month.padStart(2, '0')}-${expense.day.padStart(2, '0')}`,
          description: expense.category || 'Expense',
          category: expense.category || 'Other',
          amount: Number(expense.cost) || 0,
          type: 'expense',
          details: expense
        });
      });
    }

    // Add investments
    if (investments) {
      investments.forEach((investment: Investment) => {
        combined.push({
          id: investment.id || 0,
          date: `${investment.year}-${investment.month.padStart(2, '0')}-${investment.day.padStart(2, '0')}`,
          description: investment.name || 'Investment',
          category: investment.type || 'Investment',
          amount: Number(investment.cost) || 0,
          type: 'investment',
          details: investment
        });
      });
    }

    // Add loans
    if (loans) {
      loans.forEach((loan: Loan) => {
        combined.push({
          id: loan.id || 0,
          date: `${loan.year}-${loan.month.padStart(2, '0')}-${loan.day.padStart(2, '0')}`,
          description: loan.name || 'Loan',
          category: loan.type || 'Loan',
          amount: Number(loan.loan_amount) || 0,
          type: 'loan',
          details: loan
        });
      });
    }

    // Sort by date (newest first)
    return combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  // Filter transactions
  const filterTransactions = (transactions: CombinedTransaction[]) => {
    return transactions.filter(transaction => {
      const matchesSearch = !search || 
        transaction.description.toLowerCase().includes(search.toLowerCase()) ||
        transaction.category.toLowerCase().includes(search.toLowerCase());
      
      const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
      
      return matchesSearch && matchesType;
    });
  };

  const allTransactions = combineTransactions();
  const filteredTransactions = filterTransactions(allTransactions);
  const isLoading = incomeLoading || expenseLoading || investmentLoading || loanLoading;

  // Generate year and month options - Fixed TypeScript Set issue
  const uniqueYears = new Set(allTransactions.map(t => t.date.split('-')[0]));
  const years = Array.from(uniqueYears).sort().reverse();
  
  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'income':
        return 'bg-green-100 text-green-800';
      case 'expense':
        return 'bg-red-100 text-red-800';
      case 'investment':
        return 'bg-blue-100 text-blue-800';
      case 'loan':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'income':
        return <ArrowUpIcon className="h-4 w-4 text-green-600" />;
      case 'expense':
        return <ArrowDownIcon className="h-4 w-4 text-red-600" />;
      case 'investment':
        return <ArrowUpIcon className="h-4 w-4 text-blue-600" />;
      case 'loan':
        return <ArrowDownIcon className="h-4 w-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader
          title="All Transactions"
          subtitle={`${filteredTransactions.length} transactions found`}
          action={
            <Button 
              variant="primary" 
              onClick={() => window.location.href = '/upload'}
              className="flex items-center"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Upload Data
            </Button>
          }
        />
        <CardBody>
          {/* Filters */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search transactions..."
                className="pl-10"
              />
            </div>
            
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as TransactionType)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expenses</option>
              <option value="investment">Investments</option>
              <option value="loan">Loans</option>
            </select>

            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Years</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>

            <select
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Months</option>
              {months.map(month => (
                <option key={month.value} value={month.value}>{month.label}</option>
              ))}
            </select>
          </div>

          {/* Transactions Table */}
          {filteredTransactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTransactions.map((transaction, index) => (
                    <tr key={`${transaction.type}-${transaction.id}-${index}`} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(transaction.date).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getTypeIcon(transaction.type)}
                          <span className="ml-2 text-sm text-gray-900">{transaction.description}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ₹{transaction.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeColor(transaction.type)}`}>
                          {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <FunnelIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
              <p className="text-gray-600 mb-6">
                {allTransactions.length === 0 
                  ? "Start by uploading your financial data to see transactions here."
                  : "Try adjusting your search or filters to find what you're looking for."
                }
              </p>
              {allTransactions.length === 0 && (
                <Button 
                  variant="primary" 
                  onClick={() => window.location.href = '/upload'}
                >
                  Upload Data
                </Button>
              )}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default Transactions;