// src/pages/profile/Profile.tsx
import React, { useState } from 'react';
import { useQueries, useQuery, useMutation } from '@tanstack/react-query';
import { authAPI, configAPI } from '../../services/api';
import { Card, CardHeader, CardBody, Button, Input } from '../../components/ui';
import { Config, YearlyClosingBankBalance, NAV } from '../../types/config';
import { UserProfile } from '../../types/auth';
import { useNavigate } from 'react-router-dom';
import { 
  UserIcon, 
  ChartBarIcon,
  BanknotesIcon,
  DocumentTextIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  PlusIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';

// Loading skeleton components
const StatusCardSkeleton = () => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
      <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
    </div>
    <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-48"></div>
  </div>
);

const TableSkeleton = () => (
  <div className="animate-pulse space-y-3">
    <div className="h-10 bg-gray-200 rounded"></div>
    {[...Array(3)].map((_, i) => (
      <div key={i} className="h-12 bg-gray-100 rounded"></div>
    ))}
  </div>
);

const Profile: React.FC = () => {
  const navigate = useNavigate();

  /* ===================== HELPERS ===================== */
  const isOutdated = (dateStr?: string) => {
    if (!dateStr) return true;
    const updated = new Date(dateStr);
    const now = new Date();
    return (
      updated.getMonth() !== now.getMonth() ||
      updated.getFullYear() !== now.getFullYear()
    );
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Not set';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Fetch profile, config, yearly balance
  const [profileQ, configQ, yearlyQ] = useQueries({
    queries: [
      { queryKey: ['profile'], queryFn: () => authAPI.getProfile() },
      { queryKey: ['userConfig'], queryFn: () => configAPI.getConfig() },
      { queryKey: ['yearlyBalance'], queryFn: () => configAPI.getYearlyClosingBalance() },
    ],
  });

  // Fetch NAVs
  const navsQ = useQuery({
    queryKey: ['navs'],
    queryFn: () => configAPI.getNavs(),
  });

  // Fetch All Year closing Balance
  const listYClosingBalQ = useQuery({
    queryKey: ['allyearlyBalance'],
    queryFn: () => configAPI.getAllYearlyClosingBalance(),
  });

  // Update yearly closing balance
  const updateBalanceM = useMutation({
    mutationFn: (payload: { financial_year: string; closing_balance: number }) =>
      configAPI.updateYearlyClosingBalance(payload),
    onSuccess: () => {
      yearlyQ.refetch();
      listYClosingBalQ.refetch();
      setClosingBalance('');
      alert('Balance updated successfully!');
    },
    onError: () => alert('Failed to update balance'),
  });

  // Refresh NAVs
  const refreshNavsM = useMutation({
    mutationFn: () => configAPI.updateNavs(),
    onSuccess: () => {
      navsQ.refetch();
      alert('NAVs refreshed successfully!');
    },
    onError: () => alert('Failed to refresh NAVs'),
  });

  // Add NAV
  const addNavM = useMutation({
    mutationFn: (data: Omit<NAV, 'last_updated'>) => configAPI.addNav(data),
    onSuccess: () => {
      navsQ.refetch();
      setNavInput({
        type: '',
        fund_name: '',
        unique_identifier: '',
        nav: undefined,
      });
      alert('Investment added successfully!');
    },
    onError: () => alert('Failed to add investment'),
  });

  // Local state
  const currentYear = new Date().getFullYear();
  const [financialYear, setFinancialYear] = useState(`${currentYear}-${currentYear + 1}`);
  const [closingBalance, setClosingBalance] = useState('');
  const [navInput, setNavInput] = useState<Omit<NAV, 'last_updated'>>({
    type: '',
    fund_name: '',
    unique_identifier: '',
    nav: undefined,
  });

  const isLoading = profileQ.isLoading || configQ.isLoading || yearlyQ.isLoading;

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-70px)] overflow-auto bg-gray-50 p-3">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header Skeleton */}
          <Card>
            <CardBody>
              <div className="flex items-center space-x-6 animate-pulse">
                <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-8 bg-gray-200 rounded w-48"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-4 bg-gray-200 rounded w-64"></div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Status Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatusCardSkeleton />
            <StatusCardSkeleton />
            <StatusCardSkeleton />
          </div>
        </div>
      </div>
    );
  }
  
  if (!profileQ.data) {
    return (
      <div className="h-[calc(100vh-70px)] flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 text-lg font-medium">Failed to load profile</p>
          <Button onClick={() => profileQ.refetch()} className="mt-4" variant="primary">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const profile = profileQ.data as UserProfile;
  const config = configQ.data as Config;
  const yearly = yearlyQ.data as YearlyClosingBankBalance;

  const handleUpdateBalance = () => {
    const val = parseFloat(closingBalance);
    if (isNaN(val) || val < 0) {
      return alert('Please enter a valid positive number');
    }
    updateBalanceM.mutate({ financial_year: financialYear, closing_balance: val });
  };

  const handleAddNav = () => {
    if (!navInput.type || !navInput.fund_name || !navInput.unique_identifier) {
      return alert('Please fill all required fields');
    }
    addNavM.mutate(navInput);
  };

  const StatusCard = ({ 
    title, 
    lastUpdated, 
    icon: Icon, 
    color, 
    bgColor,
    outdated 
  }: {
    title: string;
    lastUpdated?: string;
    icon: any;
    color: string;
    bgColor: string;
    outdated: boolean;
  }) => (
    <div 
      className={`bg-white rounded-xl p-6 shadow-sm border transition-all duration-200 ${
        outdated 
          ? 'border-red-300 cursor-pointer hover:shadow-md hover:border-red-400' 
          : 'border-gray-200'
      }`}
      onClick={() => outdated && navigate('/upload')}
    >
      <div className="flex items-center justify-between mb-1">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bgColor}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <span className={`text-xs px-3 py-1.5 rounded-full font-medium flex items-center space-x-1 ${
          outdated
            ? 'text-red-700 bg-red-100'
            : 'text-green-700 bg-green-100'
        }`}>
          {outdated ? (
            <>
              <ExclamationTriangleIcon className="h-3.5 w-3.5" />
              <span>Update Required</span>
            </>
          ) : (
            <>
              <CheckCircleIcon className="h-3.5 w-3.5" />
              <span>Up to date</span>
            </>
          )}
        </span>
      </div>
      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500">
        Last updated: {formatDate(lastUpdated)}
      </p>
    </div>
  );

  return (
    <div className="bg-gray-50 p-3">
      <div className="max-w-7xl mx-auto space-y-3">
        {/* Profile Header */}
        <Card>
          <CardBody>
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <UserIcon className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{profile.username}</h1>
                <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">User ID:</span>
                    <span className="px-2 py-1 bg-gray-100 rounded">{profile.id}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="h-4 w-4" />
                    <span>Last sync: {formatDate(config?.last_updated_date)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <BanknotesIcon className="h-4 w-4" />
                    <span>
                      Closing Balance: ₹{yearly?.closing_balance?.toLocaleString('en-IN') || '0'} 
                      <span className="text-gray-400 ml-1">(FY {yearly?.financial_year})</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Data Sync Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <StatusCard
            title="Investment Data"
            lastUpdated={config?.invest_last_updated_date}
            icon={ChartBarIcon}
            color="text-blue-600"
            bgColor="bg-blue-50"
            outdated={isOutdated(config?.invest_last_updated_date)}
          />
          <StatusCard
            title="Expense Data"
            lastUpdated={config?.expense_last_updated_date}
            icon={BanknotesIcon}
            color="text-green-600"
            bgColor="bg-green-50"
            outdated={isOutdated(config?.expense_last_updated_date)}
          />
          <StatusCard
            title="Financial Data"
            lastUpdated={config?.financial_last_updated_date}
            icon={DocumentTextIcon}
            color="text-purple-600"
            bgColor="bg-purple-50"
            outdated={isOutdated(config?.financial_last_updated_date)}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 items-start">
          {/* Left Column - Balance Management */}
          <div className="lg:col-span-1 space-y-2">
            {/* Update Balance Form */}
            <Card>
              <CardHeader title="Update Closing Balance" />
              <CardBody className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Financial Year
                  </label>
                  <select
                    value={financialYear}
                    onChange={e => setFinancialYear(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    {Array.from({ length: 51 }, (_, i) => {
                      const startYear = 2010 + i;
                      const endYear = startYear + 1;
                      return (
                        <option key={startYear} value={`${startYear}-${endYear}`}>
                          FY {startYear}-{endYear}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Closing Balance (₹)
                  </label>
                  <Input
                    type="number"
                    value={closingBalance}
                    onChange={e => setClosingBalance(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full"
                  />
                </div>
                <Button 
                  onClick={handleUpdateBalance} 
                  variant="primary" 
                  className="w-full"
                  disabled={updateBalanceM.isPending}
                >
                  {updateBalanceM.isPending ? 'Updating...' : 'Update Balance'}
                </Button>
              </CardBody>
            </Card>

            {/* Balance History */}
            <Card>
              <CardHeader title="Balance History" />
              <CardBody>
                {listYClosingBalQ.isLoading ? (
                  <TableSkeleton />
                ) : listYClosingBalQ.data && listYClosingBalQ.data.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            FY
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Balance
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {listYClosingBalQ.data.map((item: any) => (
                          <tr key={item.financial_year} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-800 whitespace-nowrap">
                              {item.financial_year}
                            </td>
                            <td className="px-4 py-3 text-sm font-medium text-right text-gray-900 whitespace-nowrap">
                              ₹{item.closing_balance?.toLocaleString('en-IN')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <BanknotesIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm">No balance history available</p>
                  </div>
                )}
              </CardBody>
            </Card>
          </div>

          {/* Right Column - NAV Management */}
          <div className="lg:col-span-2 space-y-2">
            {/* Add Investment Card */}
            <Card>
              <CardHeader 
                title="Add New Investment"
                action={
                  <PlusIcon className="h-2 w-5 text-gray-400" />
                }
              />
              <CardBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type *
                    </label>
                    <Input
                      placeholder="e.g., MUTUALFUND, EQUITY"
                      value={navInput.type}
                      onChange={e =>
                        setNavInput(prev => ({ ...prev, type: e.target.value }))
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fund Name *
                    </label>
                    <Input
                      placeholder="e.g., HDFC Top 100 Fund"
                      value={navInput.fund_name}
                      onChange={e =>
                        setNavInput(prev => ({ ...prev, fund_name: e.target.value }))
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unique Identifier *
                    </label>
                    <Input
                      placeholder="ISIN / AMFI Code / Symbol"
                      value={navInput.unique_identifier}
                      onChange={e =>
                        setNavInput(prev => ({
                          ...prev,
                          unique_identifier: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current NAV (Optional)
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="e.g., 125.50"
                      value={navInput.nav ?? ''}
                      onChange={e =>
                        setNavInput(prev => ({
                          ...prev,
                          nav: e.target.value ? parseFloat(e.target.value) : undefined,
                        }))
                      }
                    />
                  </div>
                </div>

                <Button
                  onClick={handleAddNav}
                  variant="primary"
                  className="w-full md:w-auto mt-3"
                  disabled={addNavM.isPending}
                >
                  {addNavM.isPending ? 'Adding...' : 'Add Investment'}
                </Button>
              </CardBody>
            </Card>
            
            {/* Current NAVs Card */}
            <Card>
              <CardHeader 
                title="Current NAVs"
                action={
                  <Button
                    onClick={() => refreshNavsM.mutate()}
                    variant="outline"
                    disabled={refreshNavsM.isPending}
                    className="flex items-center space-x-2"
                  >
                    <ArrowPathIcon className={`h-4 w-4 ${refreshNavsM.isPending ? 'animate-spin' : ''}`} />
                    <span>{refreshNavsM.isPending ? 'Refreshing...' : 'Refresh NAVs'}</span>
                  </Button>
                }
              />
              <CardBody className="pt-0 -mt-3">
                {navsQ.isLoading ? (
                  <div className="flex items-center justify-center py-0 ">
                    <div className="animate-spin rounded-full h-0 w-10 border-b-1 border-green-600"></div>
                  </div>
                ) : navsQ.data && navsQ.data.length > 0 ? (
                  <div className="max-h-64 overflow-y-auto space-y-1 pr-1">
                    {navsQ.data.map((nav) => (
                      <div
                        key={nav.unique_identifier}
                        className="flex items-center justify-between p-1 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
                      >
                        <div className="flex items-center space-x-4 flex-0 min-w-0">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-lg">
                              {nav.type?.charAt(0) || 'N'}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">
                              {nav.fund_name}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {nav.type} • {nav.unique_identifier}
                            </p>
                          </div>
                        </div>
                        <div className="text-right ml-4 flex-shrink-0">
                          <p className="font-semibold text-lg text-gray-900">
                            ₹{nav.nav?.toFixed(2) || 'N/A'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(nav.last_updated)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <ChartBarIcon className="w-16 h-16 mx-auto mb-3 text-gray-300" />
                    <p className="text-gray-500 mb-1">No NAVs found</p>
                    <p className="text-sm text-gray-400">Add your first investment above</p>
                  </div>
                )}
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;