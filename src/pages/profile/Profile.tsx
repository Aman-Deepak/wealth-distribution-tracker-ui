// src/pages/profile/Profile.tsx
import React, { useState } from 'react';
import { useQueries, useQuery, useMutation } from '@tanstack/react-query';
import { authAPI, configAPI } from '../../services/api';
import { Card, CardHeader, CardBody, Button, Input } from '../../components/ui';
import { Config, YearlyClosingBankBalance, NAV } from '../../types/config';
import { UserProfile } from '../../types/auth';
import { 
  UserIcon, 
  CogIcon, 
  BanknotesIcon, 
  ChartBarIcon,
  CalendarDaysIcon,
  DocumentTextIcon 
} from '@heroicons/react/24/outline';

const Profile: React.FC = () => {
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

  // Update yearly closing balance
  const updateBalanceM = useMutation({
    mutationFn: (payload: { financial_year: string; closing_balance: number }) =>
      configAPI.updateYearlyClosingBalance(payload),
    onSuccess: () => yearlyQ.refetch(),
  });

  // Refresh NAVs
  const refreshNavsM = useMutation({
    mutationFn: () => configAPI.updateNavs(),
    onSuccess: () => navsQ.refetch(),
  });

  // Add NAV
  const addNavM = useMutation({
    mutationFn: (data: Omit<NAV, 'last_updated'>) => configAPI.addNav(data),
    onSuccess: () => navsQ.refetch(),
  });

  // Local state
  const [financialYear, setFinancialYear] = useState(new Date().getFullYear().toString());
  const [closingBalance, setClosingBalance] = useState('');
  const [navInput, setNavInput] = useState<Omit<NAV, 'last_updated'>>({
    type: '',
    fund_name: '',
    unique_identifier: '',
    nav: undefined,
  });

  if (profileQ.isLoading || configQ.isLoading || yearlyQ.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }
  
  if (!profileQ.data) {
    return <p className="p-6 text-red-600">Failed to load profile.</p>;
  }

  const profile = profileQ.data as UserProfile;
  const config = configQ.data as Config;
  const yearly = yearlyQ.data as YearlyClosingBankBalance;

  const handleUpdateBalance = () => {
    const val = parseFloat(closingBalance);
    if (isNaN(val)) return alert('Enter valid number');
    updateBalanceM.mutate({ financial_year: financialYear, closing_balance: val });
  };

  const handleAddNav = () => {
    if (!navInput.type || !navInput.fund_name || !navInput.unique_identifier) {
      return alert('Fill required fields');
    }
    addNavM.mutate(navInput);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <UserIcon className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">{profile.username}</h1>
              <p className="text-blue-100 text-lg">User ID: {profile.id}</p>
              <p className="text-blue-200">Account Settings & Configuration</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Top Row - Config Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CalendarDaysIcon className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full font-medium">Active</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Last Updated</h3>
            <p className="text-sm text-gray-500">{config?.last_updated_date || 'Not set'}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <ChartBarIcon className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full font-medium">Synced</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Investment Data</h3>
            <p className="text-sm text-gray-500">{config?.invest_last_updated_date || 'Not set'}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <BanknotesIcon className="w-6 h-6 text-red-600" />
              </div>
              <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full font-medium">Updated</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Expense Data</h3>
            <p className="text-sm text-gray-500">{config?.expense_last_updated_date || 'Not set'}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <DocumentTextIcon className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full font-medium">Ready</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Financial Data</h3>
            <p className="text-sm text-gray-500">{config?.financial_last_updated_date || 'Not set'}</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Balance Management */}
          <div className="lg:col-span-1 space-y-6">
            {/* Current Balance Display */}
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardBody className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BanknotesIcon className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Current Balance</h3>
                <p className="text-3xl font-bold text-green-600 mb-1">
                  ₹{yearly?.closing_balance?.toLocaleString() || '0'}
                </p>
                <p className="text-sm text-green-700 bg-green-100 px-3 py-1 rounded-full inline-block">
                  FY {yearly?.financial_year || 'N/A'}
                </p>
              </CardBody>
            </Card>

            {/* Update Balance */}
            <Card>
              <CardHeader title="Update Balance" />
              <CardBody className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Financial Year</label>
                  <Input
                    value={financialYear}
                    onChange={e => setFinancialYear(e.target.value)}
                    placeholder="e.g., 2024"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Closing Balance</label>
                  <Input
                    value={closingBalance}
                    onChange={e => setClosingBalance(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full"
                  />
                </div>
                <Button onClick={handleUpdateBalance} variant="primary" className="w-full">
                  Update Balance
                </Button>
              </CardBody>
            </Card>
          </div>

          {/* Right Column - NAV Management */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader 
                title="Investment NAV Management" 
                action={
                  <Button onClick={() => refreshNavsM.mutate()} variant="outline">
                    Refresh All NAVs
                  </Button>
                }
              />
              <CardBody>
                {/* NAV List */}
                <div className="mb-8">
                  <h4 className="font-medium text-gray-900 mb-4">Current NAVs</h4>
                  {navsQ.isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : navsQ.data && navsQ.data.length > 0 ? (
                    <div className="grid gap-4">
                      {navsQ.data.map((nav, index) => (
                        <div key={nav.unique_identifier} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <span className="text-blue-600 font-semibold text-sm">
                                {nav.type?.charAt(0) || 'N'}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{nav.fund_name}</p>
                              <p className="text-sm text-gray-500">{nav.type} • {nav.unique_identifier}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-lg text-gray-900">₹{nav.nav?.toFixed(2) || 'N/A'}</p>
                            <p className="text-xs text-gray-500">{nav.last_updated || 'No date'}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <ChartBarIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No NAVs found. Add your first investment below.</p>
                    </div>
                  )}
                </div>

                {/* Add NAV Form */}
                <div className="border-t pt-6">
                  <h4 className="font-medium text-gray-900 mb-4">Add New Investment</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                      <Input
                        placeholder="e.g., EQUITY, DEBT, HYBRID"
                        value={navInput.type}
                        onChange={e => setNavInput(prev => ({ ...prev, type: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Fund Name</label>
                      <Input
                        placeholder="e.g., HDFC Top 100 Fund"
                        value={navInput.fund_name}
                        onChange={e => setNavInput(prev => ({ ...prev, fund_name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Unique Identifier</label>
                      <Input
                        placeholder="ISIN, AMFI Code, or Symbol"
                        value={navInput.unique_identifier}
                        onChange={e => setNavInput(prev => ({ ...prev, unique_identifier: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current NAV (Optional)</label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Current NAV value"
                        value={navInput.nav ?? ''}
                        onChange={e => setNavInput(prev => ({ ...prev, nav: parseFloat(e.target.value) }))}
                      />
                    </div>
                  </div>
                  <Button onClick={handleAddNav} variant="primary" className="w-full md:w-auto">
                    Add Investment
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
