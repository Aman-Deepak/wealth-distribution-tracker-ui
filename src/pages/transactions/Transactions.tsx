// src/pages/transactions/Transactions.tsx
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardHeader, CardBody, Input, Button, Modal } from '../../components/ui';
import { incomeAPI, expenseAPI, investmentAPI, loanAPI } from '../../services/api';
import { Income, Expense, Investment, Loan } from '../../types';
import { 
  MagnifyingGlassIcon,
  PlusIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

type TransactionType = 'all' | 'income' | 'expense' | 'investment' | 'loan';
type SortDirection = 'asc' | 'desc' | null;
type CombinedTransaction = {
  id: number;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: 'income' | 'expense' | 'investment' | 'loan';
  direction: 'up' | 'down';
  details?: any;
};

const Transactions: React.FC = () => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<TransactionType>('all');
  const [yearFilters, setYearFilters] = useState<string[]>([]);
  const [monthFilters, setMonthFilters] = useState<string[]>([]);
  const [categoryFilters, setCategoryFilters] = useState<string[]>([]);
  const [descriptionFilters, setDescriptionFilters] = useState<string[]>([]);
  const [directionFilters, setDirectionFilters] = useState<string[]>([]);
  const [dateSortDirection, setDateSortDirection] = useState<SortDirection>(null);
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

  // Ref for filters container to handle click outside
  const filtersRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filtersRef.current && !filtersRef.current.contains(event.target as Node)) {
        // Close all dropdowns
        const dropdowns = filtersRef.current.querySelectorAll('.absolute.z-20');
        dropdowns.forEach(dropdown => dropdown.classList.add('hidden'));
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch data from all transaction types
  const { data: incomes, isLoading: incomeLoading, refetch: refetchIncomes } = useQuery({
    queryKey: ['incomes'],
    queryFn: () => incomeAPI.getIncome({ 
      skip: 0, 
      limit: 10000,
    }),
  });

  const { data: expenses, isLoading: expenseLoading, refetch: refetchExpenses } = useQuery({
    queryKey: ['expenses'],
    queryFn: () => expenseAPI.getExpenses({ 
      skip: 0, 
      limit: 10000,
    }),
  });

  const { data: investments, isLoading: investmentLoading, refetch: refetchInvestments } = useQuery({
    queryKey: ['investments'],
    queryFn: () => investmentAPI.getInvestments({ 
      skip: 0, 
      limit: 10000,
    }),
  });

  const { data: loans, isLoading: loanLoading, refetch: refetchLoans } = useQuery({
    queryKey: ['loans'],
    queryFn: () => loanAPI.getLoans({}),
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
          direction: 'up',
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
          category: expense.type || 'Other',
          amount: Number(expense.cost) || 0,
          type: 'expense',
          direction: 'down',
          details: expense
        });
      });
    }

    if (investments) {
      investments.forEach((investment: Investment) => {
        // Determine direction based on order type
        const isBuy = investment.type_of_order?.toLowerCase() === 'buy';
        combined.push({
          id: investment.id || 0,
          date: `${investment.year}-${investment.month.padStart(2, '0')}-${investment.day.padStart(2, '0')}`,
          description: investment.name || 'Investment',
          category: investment.type || 'Investment',
          amount: Number(investment.cost) || 0,
          type: 'investment',
          direction: isBuy ? 'down' : 'up', // Buy = money out (down), Sell = money in (up)
          details: investment
        });
      });
    }

    if (loans) {
      loans.forEach((loan: Loan) => {
        // Determine direction: borrowed = money in (down red), repayment = money out (up green)
        const isBorrowed = loan.loan_amount !== 0;
        const loan_type = isBorrowed ? "Borrowed By" : "Repayment To";
        combined.push({
          id: loan.id || 0,
          date: `${loan.year}-${loan.month.padStart(2, '0')}-${loan.day.padStart(2, '0')}`,
          description: `${loan_type}-${loan.name}` || 'Loan',
          category: loan.type || 'Loan',
          amount: Number(loan.loan_amount) || Number(loan.loan_repayment),
          type: 'loan',
          direction: isBorrowed ? 'down' : 'up', // Borrowed = down, Repayment = up
          details: loan
        });
      });
    }

    return combined;
  };

  // Filter transactions
  const filterTransactions = (transactions: CombinedTransaction[]) => {
    return transactions.filter(transaction => {
      const transactionYear = transaction.date.split('-')[0];
      const transactionMonth = transaction.date.split('-')[1];
      
      const matchesSearch = !search || 
        transaction.description.toLowerCase().includes(search.toLowerCase()) ||
        transaction.category.toLowerCase().includes(search.toLowerCase());
      
      const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
      
      const matchesYear = yearFilters.length === 0 || yearFilters.includes(transactionYear);
      
      const matchesMonth = monthFilters.length === 0 || monthFilters.includes(transactionMonth);
      
      const matchesCategory = categoryFilters.length === 0 || 
        categoryFilters.some(filter => transaction.category.toLowerCase().includes(filter.toLowerCase()));
      
      const matchesDescription = descriptionFilters.length === 0 || 
        descriptionFilters.some(filter => transaction.description.toLowerCase().includes(filter.toLowerCase()));
      
      const matchesDirection = directionFilters.length === 0 || directionFilters.includes(transaction.direction);
      
      return matchesSearch && matchesType && matchesYear && matchesMonth && matchesCategory && matchesDescription && matchesDirection;
    });
  };

  // Sort transactions
  const sortTransactions = (transactions: CombinedTransaction[]) => {
    if (!dateSortDirection) {
      // Default sort: newest first
      return [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    
    return [...transactions].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateSortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    });
  };

  const allTransactions = combineTransactions();
  const filteredTransactions = filterTransactions(allTransactions);
  const sortedTransactions = sortTransactions(filteredTransactions);
  const isLoading = incomeLoading || expenseLoading || investmentLoading || loanLoading;

  // Calculate statistics
  const statistics = useMemo(() => {
    const count = sortedTransactions.length;
    const sum = sortedTransactions.reduce((acc, t) => acc + t.amount, 0);
    const average = count > 0 ? sum / count : 0;
    
    // Calculate unique month-year combinations
    const uniqueMonths = new Set(
      sortedTransactions.map(t => {
        const date = new Date(t.date);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      })
    );
    const monthCount = uniqueMonths.size;
    const monthlyAverage = monthCount > 0 ? sum / monthCount : 0;
    
    return { count, sum, average, monthlyAverage, monthCount };
  }, [sortedTransactions]);

  // Generate unique categories and descriptions for filter dropdowns
  const uniqueCategories = useMemo(() => {
    const categories = new Set(allTransactions.map(t => t.category).filter(Boolean));
    return Array.from(categories).sort();
  }, [allTransactions]);

  const uniqueDescriptions = useMemo(() => {
    const descriptions = new Set(allTransactions.map(t => t.description).filter(Boolean));
    return Array.from(descriptions).sort();
  }, [allTransactions]);

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

  const getDirectionIcon = (direction: 'up' | 'down', type: string) => {
    if (direction === 'up') {
      return <ArrowUpIcon className={`h-5 w-5 ${type === 'income' ? 'text-green-600' : type === 'loan' ? 'text-green-600' : 'text-blue-600'}`} />;
    } else {
      return <ArrowDownIcon className={`h-5 w-5 ${type === 'expense' ? 'text-red-600' : type === 'loan' ? 'text-red-600' : 'text-blue-600'}`} />;
    }
  };

  const handleMultiSelectChange = (
    currentValues: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    selectedOptions: HTMLCollectionOf<HTMLOptionElement>
  ) => {
    const selected = Array.from(selectedOptions)
      .filter(option => option.selected)
      .map(option => option.value);
    setter(selected);
  };

  const toggleDateSort = () => {
    if (dateSortDirection === null) {
      setDateSortDirection('asc');
    } else if (dateSortDirection === 'asc') {
      setDateSortDirection('desc');
    } else {
      setDateSortDirection(null);
    }
  };

  // Helper function to get filter display text - always shows label
  const getFilterDisplayText = (
    selectedValues: string[],
    label: string,
    valueLabels?: Record<string, string>
  ): string => {
    if (selectedValues.length === 0) {
      return label;
    } else if (selectedValues.length === 1) {
      const displayValue = valueLabels ? valueLabels[selectedValues[0]] || selectedValues[0] : selectedValues[0];
      return `${label}: ${displayValue}`;
    } else {
      return `${label} (${selectedValues.length})`;
    }
  };

  // Direction display labels
  const directionLabels: Record<string, string> = {
    'up': '↑ Up',
    'down': '↓ Down'
  };

  // Month display labels
  const monthLabels: Record<string, string> = months.reduce((acc, m) => {
    acc[m.value] = m.label;
    return acc;
  }, {} as Record<string, string>);

  // Helper function to toggle dropdown and close others
  const toggleDropdown = (e: React.MouseEvent<HTMLDivElement>) => {
    const currentDropdown = e.currentTarget.nextElementSibling as HTMLElement;
    
    // Close all other dropdowns first
    if (filtersRef.current) {
      const allDropdowns = filtersRef.current.querySelectorAll('.absolute.z-20');
      allDropdowns.forEach(dropdown => {
        if (dropdown !== currentDropdown) {
          dropdown.classList.add('hidden');
        }
      });
    }
    
    // Toggle current dropdown
    currentDropdown?.classList.toggle('hidden');
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
    <div className="h-[calc(100vh-70px)] flex flex-col p-1">
      <Card className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <CardBody className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {/* Filters */}
          <div ref={filtersRef} className="mb-4 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-3 flex-shrink-0">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search transactions..."
                className="h-10 px-3 text-sm"
              />
            </div>
            
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as TransactionType)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expenses</option>
              <option value="investment">Investments</option>
              <option value="loan">Loans</option>
            </select>

            {/* Categories Filter */}
            <div className="relative">
              <div
                className={`flex items-center justify-between w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white cursor-pointer hover:border-gray-400 ${categoryFilters.length > 0 ? 'pr-8' : ''}`}
                onClick={toggleDropdown}
              >
                <span className="truncate">{getFilterDisplayText(categoryFilters, 'Categories')}</span>
                <ChevronDownIcon className="h-4 w-4 text-gray-400 flex-shrink-0 ml-2" />
              </div>
              <div className="hidden absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                {uniqueCategories.map(category => (
                  <label
                    key={category}
                    className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={categoryFilters.includes(category)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setCategoryFilters([...categoryFilters, category]);
                        } else {
                          setCategoryFilters(categoryFilters.filter(c => c !== category));
                        }
                      }}
                      className="mr-2"
                    />
                    {category}
                  </label>
                ))}
              </div>
              {categoryFilters.length > 0 && (
                <button
                  onClick={(e) => { e.stopPropagation(); setCategoryFilters([]); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 hover:bg-gray-200 rounded-full z-10"
                  title="Clear filter"
                >
                  <XMarkIcon className="h-4 w-4 text-gray-500" />
                </button>
              )}
            </div>

            {/* Descriptions Filter */}
            <div className="relative">
              <div
                className={`flex items-center justify-between w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white cursor-pointer hover:border-gray-400 ${descriptionFilters.length > 0 ? 'pr-8' : ''}`}
                onClick={toggleDropdown}
              >
                <span className="truncate">{getFilterDisplayText(descriptionFilters, 'Descriptions')}</span>
                <ChevronDownIcon className="h-4 w-4 text-gray-400 flex-shrink-0 ml-2" />
              </div>
              <div className="hidden absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                {uniqueDescriptions.map(description => (
                  <label
                    key={description}
                    className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={descriptionFilters.includes(description)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setDescriptionFilters([...descriptionFilters, description]);
                        } else {
                          setDescriptionFilters(descriptionFilters.filter(d => d !== description));
                        }
                      }}
                      className="mr-2"
                    />
                    {description}
                  </label>
                ))}
              </div>
              {descriptionFilters.length > 0 && (
                <button
                  onClick={(e) => { e.stopPropagation(); setDescriptionFilters([]); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 hover:bg-gray-200 rounded-full z-10"
                  title="Clear filter"
                >
                  <XMarkIcon className="h-4 w-4 text-gray-500" />
                </button>
              )}
            </div>

            {/* Direction Filter */}
            <div className="relative">
              <div
                className={`flex items-center justify-between w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white cursor-pointer hover:border-gray-400 ${directionFilters.length > 0 ? 'pr-8' : ''}`}
                onClick={toggleDropdown}
              >
                <span className="truncate">{getFilterDisplayText(directionFilters, 'Direction', directionLabels)}</span>
                <ChevronDownIcon className="h-4 w-4 text-gray-400 flex-shrink-0 ml-2" />
              </div>
              <div className="hidden absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                <label className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm">
                  <input
                    type="checkbox"
                    checked={directionFilters.includes('up')}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setDirectionFilters([...directionFilters, 'up']);
                      } else {
                        setDirectionFilters(directionFilters.filter(d => d !== 'up'));
                      }
                    }}
                    className="mr-2"
                  />
                  ↑ Up (Income/Sell)
                </label>
                <label className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm">
                  <input
                    type="checkbox"
                    checked={directionFilters.includes('down')}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setDirectionFilters([...directionFilters, 'down']);
                      } else {
                        setDirectionFilters(directionFilters.filter(d => d !== 'down'));
                      }
                    }}
                    className="mr-2"
                  />
                  ↓ Down (Expense/Buy)
                </label>
              </div>
              {directionFilters.length > 0 && (
                <button
                  onClick={(e) => { e.stopPropagation(); setDirectionFilters([]); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 hover:bg-gray-200 rounded-full z-10"
                  title="Clear filter"
                >
                  <XMarkIcon className="h-4 w-4 text-gray-500" />
                </button>
              )}
            </div>

            {/* Years Filter */}
            <div className="relative">
              <div
                className={`flex items-center justify-between w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white cursor-pointer hover:border-gray-400 ${yearFilters.length > 0 ? 'pr-8' : ''}`}
                onClick={toggleDropdown}
              >
                <span className="truncate">{getFilterDisplayText(yearFilters, 'Years')}</span>
                <ChevronDownIcon className="h-4 w-4 text-gray-400 flex-shrink-0 ml-2" />
              </div>
              <div className="hidden absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                {years.map(year => (
                  <label
                    key={year}
                    className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={yearFilters.includes(year)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setYearFilters([...yearFilters, year]);
                        } else {
                          setYearFilters(yearFilters.filter(y => y !== year));
                        }
                      }}
                      className="mr-2"
                    />
                    {year}
                  </label>
                ))}
              </div>
              {yearFilters.length > 0 && (
                <button
                  onClick={(e) => { e.stopPropagation(); setYearFilters([]); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 hover:bg-gray-200 rounded-full z-10"
                  title="Clear filter"
                >
                  <XMarkIcon className="h-4 w-4 text-gray-500" />
                </button>
              )}
            </div>

            {/* Months Filter */}
            <div className="relative">
              <div
                className={`flex items-center justify-between w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white cursor-pointer hover:border-gray-400 ${monthFilters.length > 0 ? 'pr-8' : ''}`}
                onClick={toggleDropdown}
              >
                <span className="truncate">{getFilterDisplayText(monthFilters, 'Months', monthLabels)}</span>
                <ChevronDownIcon className="h-4 w-4 text-gray-400 flex-shrink-0 ml-2" />
              </div>
              <div className="hidden absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                {months.map(month => (
                  <label
                    key={month.value}
                    className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={monthFilters.includes(month.value)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setMonthFilters([...monthFilters, month.value]);
                        } else {
                          setMonthFilters(monthFilters.filter(m => m !== month.value));
                        }
                      }}
                      className="mr-2"
                    />
                    {month.label}
                  </label>
                ))}
              </div>
              {monthFilters.length > 0 && (
                <button
                  onClick={(e) => { e.stopPropagation(); setMonthFilters([]); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 hover:bg-gray-200 rounded-full z-10"
                  title="Clear filter"
                >
                  <XMarkIcon className="h-4 w-4 text-gray-500" />
                </button>
              )}
            </div>
          </div>

          {/* Scrollable Transactions Table */}
          {sortedTransactions.length > 0 ? (
            <div className="flex-1 flex flex-col min-h-0">
              {/* Table with scroll */}
              <div className="flex-1 overflow-auto border border-gray-200 rounded-lg min-h-0">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                        onClick={toggleDateSort}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Date</span>
                          {dateSortDirection === 'asc' && <ChevronUpIcon className="h-4 w-4" />}
                          {dateSortDirection === 'desc' && <ChevronDownIcon className="h-4 w-4" />}
                          {dateSortDirection === null && <span className="text-gray-400 text-xs ml-1">↕</span>}
                        </div>
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                        Direction
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
                    {sortedTransactions.map((transaction, index) => (
                      <tr key={`${transaction.type}-${transaction.id}-${index}`} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(transaction.date).toLocaleDateString('en-IN')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {getDirectionIcon(transaction.direction, transaction.type)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.description}
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

              {/* Footer with Statistics - Fixed at bottom */}
              <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 flex-shrink-0 rounded-b-lg">
                <div className="flex items-center justify-between">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Count
                      </span>
                      <span className="mt-1 text-lg font-semibold text-gray-900">
                        {statistics.count}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Sum
                      </span>
                      <span className="mt-1 text-lg font-semibold text-gray-900">
                        ₹{statistics.sum.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Monthly Avg ({statistics.monthCount} months)
                      </span>
                      <span className="mt-1 text-lg font-semibold text-gray-900">
                        ₹{statistics.monthlyAverage.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                  <div className="ml-6">
                    <Button 
                      variant="primary" 
                      onClick={() => setShowAddModal(true)}
                      className="flex items-center"
                    >
                      <PlusIcon className="h-5 w-5 mr-2" />
                      Add Transaction
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
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