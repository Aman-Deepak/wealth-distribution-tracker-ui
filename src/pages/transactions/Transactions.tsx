// src/pages/transactions/Transactions.tsx
import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardHeader, CardBody, Input, Button, Modal } from '../../components/ui';
import { incomeAPI, expenseAPI, investmentAPI, loanAPI } from '../../services/api';
import { Income, Expense, Investment, Loan } from '../../types';
import { 
  MagnifyingGlassIcon,
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
  const [showAddModal, setShowAddModal] = useState(false);
  const [addTransactionType, setAddTransactionType] = useState<'income' | 'expense' | 'investment' | 'loan'>('income');

  // Form states for different transaction types
  const [incomeForm, setIncomeForm] = useState({
    financial_year: new Date().getFullYear().toString(),
    year: new Date().getFullYear().toString(),
    month: (new Date().getMonth() + 1).toString().padStart(2, '0'),
    day: new Date().getDate().toString().padStart(2, '0'),
    salary: '',
    tax: ''
  });

  const [expenseForm, setExpenseForm] = useState({
    financial_year: new Date().getFullYear().toString(),
    year: new Date().getFullYear().toString(),
    month: (new Date().getMonth() + 1).toString().padStart(2, '0'),
    day: new Date().getDate().toString().padStart(2, '0'),
    type: '',
    category: '',
    cost: ''
  });

  const [investmentForm, setInvestmentForm] = useState({
    financial_year: new Date().getFullYear().toString(),
    year: new Date().getFullYear().toString(),
    month: (new Date().getMonth() + 1).toString().padStart(2, '0'),
    day: new Date().getDate().toString().padStart(2, '0'),
    type: '',
    folio_number: '',
    name: '',
    type_of_order: '',
    units: '',
    nav: '',
    cost: ''
  });

  const [loanForm, setLoanForm] = useState({
    financial_year: new Date().getFullYear().toString(),
    year: new Date().getFullYear().toString(),
    month: (new Date().getMonth() + 1).toString().padStart(2, '0'),
    day: new Date().getDate().toString().padStart(2, '0'),
    type: '',
    name: '',
    interest: '',
    loan_amount: '',
    loan_repayment: '',
    cost: ''
  });

  // Fetch data from all transaction types
  const { data: incomes, isLoading: incomeLoading, refetch: refetchIncomes } = useQuery({
    queryKey: ['incomes', yearFilter, monthFilter],
    queryFn: () => incomeAPI.getIncome({ 
      skip: 0, 
      limit: 100,
      ...(yearFilter && { year: yearFilter }),
      ...(monthFilter && { month: monthFilter })
    }),
  });

  const { data: expenses, isLoading: expenseLoading, refetch: refetchExpenses } = useQuery({
    queryKey: ['expenses', yearFilter, monthFilter],
    queryFn: () => expenseAPI.getExpenses({ 
      skip: 0, 
      limit: 100,
      ...(yearFilter && { year: yearFilter }),
      ...(monthFilter && { month: monthFilter })
    }),
  });

  const { data: investments, isLoading: investmentLoading, refetch: refetchInvestments } = useQuery({
    queryKey: ['investments', yearFilter, monthFilter],
    queryFn: () => investmentAPI.getInvestments({ 
      skip: 0, 
      limit: 100,
      ...(yearFilter && { year: yearFilter }),
      ...(monthFilter && { month: monthFilter })
    }),
  });

  const { data: loans, isLoading: loanLoading, refetch: refetchLoans } = useQuery({
    queryKey: ['loans', yearFilter, monthFilter],
    queryFn: () => loanAPI.getLoans({ 
      ...(yearFilter && { year: yearFilter }),
      ...(monthFilter && { month: monthFilter })
    }),
  });

  // Mutations for adding transactions
  const addIncomeMutation = useMutation({
    mutationFn: incomeAPI.addIncome,
    onSuccess: () => {
      refetchIncomes();
      setShowAddModal(false);
      resetForms();
      alert('Income added successfully!');
    },
    onError: () => alert('Failed to add income. Please try again.'),
  });

  const addExpenseMutation = useMutation({
    mutationFn: expenseAPI.addExpense,
    onSuccess: () => {
      refetchExpenses();
      setShowAddModal(false);
      resetForms();
      alert('Expense added successfully!');
    },
    onError: () => alert('Failed to add expense. Please try again.'),
  });

  const addInvestmentMutation = useMutation({
    mutationFn: investmentAPI.addInvestment,
    onSuccess: () => {
      refetchInvestments();
      setShowAddModal(false);
      resetForms();
      alert('Investment added successfully!');
    },
    onError: () => alert('Failed to add investment. Please try again.'),
  });

  const addLoanMutation = useMutation({
    mutationFn: loanAPI.addLoan,
    onSuccess: () => {
      refetchLoans();
      setShowAddModal(false);
      resetForms();
      alert('Loan added successfully!');
    },
    onError: () => alert('Failed to add loan. Please try again.'),
  });

  const resetForms = () => {
    const currentDate = new Date();
    const defaultData = {
      financial_year: currentDate.getFullYear().toString(),
      year: currentDate.getFullYear().toString(),
      month: (currentDate.getMonth() + 1).toString().padStart(2, '0'),
      day: currentDate.getDate().toString().padStart(2, '0'),
    };

    setIncomeForm({ ...defaultData, salary: '', tax: '' });
    setExpenseForm({ ...defaultData, type: '', category: '', cost: '' });
    setInvestmentForm({ ...defaultData, type: '', folio_number: '', name: '', type_of_order: '', units: '', nav: '', cost: '' });
    setLoanForm({ ...defaultData, type: '', name: '', interest: '', loan_amount: '', loan_repayment: '', cost: '' });
  };

  const handleAddTransaction = () => {
    switch (addTransactionType) {
      case 'income':
        if (!incomeForm.salary) {
          alert('Please fill in salary amount');
          return;
        }
        addIncomeMutation.mutate({
          ...incomeForm,
          salary: parseFloat(incomeForm.salary),
          tax: parseFloat(incomeForm.tax) || 0,
        });
        break;
      case 'expense':
        if (!expenseForm.cost || !expenseForm.category) {
          alert('Please fill in category and cost');
          return;
        }
        addExpenseMutation.mutate({
          ...expenseForm,
          cost: parseFloat(expenseForm.cost),
        });
        break;
      case 'investment':
        if (!investmentForm.name || !investmentForm.cost) {
          alert('Please fill in investment name and cost');
          return;
        }
        addInvestmentMutation.mutate({
          ...investmentForm,
          units: parseFloat(investmentForm.units) || 0,
          nav: parseFloat(investmentForm.nav) || 0,
          cost: parseFloat(investmentForm.cost),
        });
        break;
      case 'loan':
        if (!loanForm.name || !loanForm.loan_amount) {
          alert('Please fill in loan name and amount');
          return;
        }
        addLoanMutation.mutate({
          ...loanForm,
          interest: parseFloat(loanForm.interest) || 0,
          loan_amount: parseFloat(loanForm.loan_amount),
          loan_repayment: parseFloat(loanForm.loan_repayment) || 0,
          cost: parseFloat(loanForm.cost) || 0,
        });
        break;
    }
  };

  // Combine and normalize all transactions (existing logic)
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

    // Add expenses, investments, loans (similar to existing logic)
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

    return combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  // Filter transactions (existing logic)
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

  // Generate year and month options
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

  const renderAddTransactionForm = () => {
    const isPending = addIncomeMutation.isPending || addExpenseMutation.isPending || 
                     addInvestmentMutation.isPending || addLoanMutation.isPending;

    switch (addTransactionType) {
      case 'income':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                <Input
                  type="text"
                  value={incomeForm.year}
                  onChange={(e) => setIncomeForm({...incomeForm, year: e.target.value})}
                  disabled={isPending}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
                <Input
                  type="text"
                  value={incomeForm.month}
                  onChange={(e) => setIncomeForm({...incomeForm, month: e.target.value})}
                  disabled={isPending}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Day</label>
                <Input
                  type="text"
                  value={incomeForm.day}
                  onChange={(e) => setIncomeForm({...incomeForm, day: e.target.value})}
                  disabled={isPending}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Financial Year</label>
                <Input
                  type="text"
                  value={incomeForm.financial_year}
                  onChange={(e) => setIncomeForm({...incomeForm, financial_year: e.target.value})}
                  disabled={isPending}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Salary *</label>
                <Input
                  type="number"
                  value={incomeForm.salary}
                  onChange={(e) => setIncomeForm({...incomeForm, salary: e.target.value})}
                  disabled={isPending}
                  placeholder="Enter salary amount"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tax</label>
                <Input
                  type="number"
                  value={incomeForm.tax}
                  onChange={(e) => setIncomeForm({...incomeForm, tax: e.target.value})}
                  disabled={isPending}
                  placeholder="Enter tax amount"
                />
              </div>
            </div>
          </div>
        );
      case 'expense':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                <Input
                  type="text"
                  value={expenseForm.year}
                  onChange={(e) => setExpenseForm({...expenseForm, year: e.target.value})}
                  disabled={isPending}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
                <Input
                  type="text"
                  value={expenseForm.month}
                  onChange={(e) => setExpenseForm({...expenseForm, month: e.target.value})}
                  disabled={isPending}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Day</label>
                <Input
                  type="text"
                  value={expenseForm.day}
                  onChange={(e) => setExpenseForm({...expenseForm, day: e.target.value})}
                  disabled={isPending}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <Input
                  type="text"
                  value={expenseForm.type}
                  onChange={(e) => setExpenseForm({...expenseForm, type: e.target.value})}
                  disabled={isPending}
                  placeholder="e.g., Fixed, Variable"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <Input
                  type="text"
                  value={expenseForm.category}
                  onChange={(e) => setExpenseForm({...expenseForm, category: e.target.value})}
                  disabled={isPending}
                  placeholder="e.g., Food, Transport"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cost *</label>
                <Input
                  type="number"
                  value={expenseForm.cost}
                  onChange={(e) => setExpenseForm({...expenseForm, cost: e.target.value})}
                  disabled={isPending}
                  placeholder="Enter cost amount"
                />
              </div>
            </div>
          </div>
        );
      case 'investment':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                <Input
                  type="text"
                  value={investmentForm.year}
                  onChange={(e) => setInvestmentForm({...investmentForm, year: e.target.value})}
                  disabled={isPending}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
                <Input
                  type="text"
                  value={investmentForm.month}
                  onChange={(e) => setInvestmentForm({...investmentForm, month: e.target.value})}
                  disabled={isPending}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Day</label>
                <Input
                  type="text"
                  value={investmentForm.day}
                  onChange={(e) => setInvestmentForm({...investmentForm, day: e.target.value})}
                  disabled={isPending}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <Input
                  type="text"
                  value={investmentForm.type}
                  onChange={(e) => setInvestmentForm({...investmentForm, type: e.target.value})}
                  disabled={isPending}
                  placeholder="e.g., MF, Stock"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                <Input
                  type="text"
                  value={investmentForm.name}
                  onChange={(e) => setInvestmentForm({...investmentForm, name: e.target.value})}
                  disabled={isPending}
                  placeholder="Investment name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Folio Number</label>
                <Input
                  type="text"
                  value={investmentForm.folio_number}
                  onChange={(e) => setInvestmentForm({...investmentForm, folio_number: e.target.value})}
                  disabled={isPending}
                  placeholder="Folio number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Order Type</label>
                <Input
                  type="text"
                  value={investmentForm.type_of_order}
                  onChange={(e) => setInvestmentForm({...investmentForm, type_of_order: e.target.value})}
                  disabled={isPending}
                  placeholder="e.g., Buy, Sell"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Units</label>
                <Input
                  type="number"
                  value={investmentForm.units}
                  onChange={(e) => setInvestmentForm({...investmentForm, units: e.target.value})}
                  disabled={isPending}
                  placeholder="Number of units"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">NAV</label>
                <Input
                  type="number"
                  value={investmentForm.nav}
                  onChange={(e) => setInvestmentForm({...investmentForm, nav: e.target.value})}
                  disabled={isPending}
                  placeholder="NAV value"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cost *</label>
                <Input
                  type="number"
                  value={investmentForm.cost}
                  onChange={(e) => setInvestmentForm({...investmentForm, cost: e.target.value})}
                  disabled={isPending}
                  placeholder="Total cost"
                />
              </div>
            </div>
          </div>
        );
      case 'loan':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                <Input
                  type="text"
                  value={loanForm.year}
                  onChange={(e) => setLoanForm({...loanForm, year: e.target.value})}
                  disabled={isPending}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
                <Input
                  type="text"
                  value={loanForm.month}
                  onChange={(e) => setLoanForm({...loanForm, month: e.target.value})}
                  disabled={isPending}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Day</label>
                <Input
                  type="text"
                  value={loanForm.day}
                  onChange={(e) => setLoanForm({...loanForm, day: e.target.value})}
                  disabled={isPending}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <Input
                  type="text"
                  value={loanForm.type}
                  onChange={(e) => setLoanForm({...loanForm, type: e.target.value})}
                  disabled={isPending}
                  placeholder="e.g., Personal, Home"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                <Input
                  type="text"
                  value={loanForm.name}
                  onChange={(e) => setLoanForm({...loanForm, name: e.target.value})}
                  disabled={isPending}
                  placeholder="Loan name/description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Interest Rate</label>
                <Input
                  type="number"
                  value={loanForm.interest}
                  onChange={(e) => setLoanForm({...loanForm, interest: e.target.value})}
                  disabled={isPending}
                  placeholder="Interest rate %"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Loan Amount *</label>
                <Input
                  type="number"
                  value={loanForm.loan_amount}
                  onChange={(e) => setLoanForm({...loanForm, loan_amount: e.target.value})}
                  disabled={isPending}
                  placeholder="Principal amount"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Repayment</label>
                <Input
                  type="number"
                  value={loanForm.loan_repayment}
                  onChange={(e) => setLoanForm({...loanForm, loan_repayment: e.target.value})}
                  disabled={isPending}
                  placeholder="Repayment amount"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cost</label>
                <Input
                  type="number"
                  value={loanForm.cost}
                  onChange={(e) => setLoanForm({...loanForm, cost: e.target.value})}
                  disabled={isPending}
                  placeholder="Total cost"
                />
              </div>
            </div>
          </div>
        );
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
              onClick={() => setShowAddModal(true)}
              className="flex items-center"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Transaction
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
              <p className="text-gray-600 mb-6">
                {allTransactions.length === 0 
                  ? "Start by adding your first transaction."
                  : "Try adjusting your search or filters to find what you're looking for."
                }
              </p>
              <Button 
                variant="primary" 
                onClick={() => setShowAddModal(true)}
              >
                Add Transaction
              </Button>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Add New Transaction"
        >
          <div className="space-y-6">
            {/* Transaction Type Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transaction Type
              </label>
              <select
                value={addTransactionType}
                onChange={(e) => setAddTransactionType(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
                <option value="investment">Investment</option>
                <option value="loan">Loan</option>
              </select>
            </div>

            {/* Dynamic Form */}
            {renderAddTransactionForm()}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                variant="secondary"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleAddTransaction}
                disabled={addIncomeMutation.isPending || addExpenseMutation.isPending || 
                         addInvestmentMutation.isPending || addLoanMutation.isPending}
              >
                {(addIncomeMutation.isPending || addExpenseMutation.isPending || 
                  addInvestmentMutation.isPending || addLoanMutation.isPending) 
                  ? 'Adding...' : 'Add Transaction'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Transactions;
