// src/pages/profile/Profile.tsx
import React, { useState } from 'react';
import { useQueries, useMutation } from '@tanstack/react-query';
import { authAPI, configAPI } from '../../services/api';
import { Card, CardHeader, CardBody, Button, Input } from '../../components/ui';
import { Config, YearlyClosingBankBalance, NAV } from '../../types/config';
import { UserProfile } from '../../types';

const Profile: React.FC = () => {
  const [profileQuery, configQuery, yearlyBalanceQuery] = useQueries({
    queries: [
      { queryKey: ['profile'], queryFn: () => authAPI.getProfile() },
      { queryKey: ['userConfig'], queryFn: () => configAPI.getConfig() },
      { queryKey: ['yearlyClosingBalance'], queryFn: () => configAPI.getYearlyClosingBalance() },
    ],
  });

  const [closingBalance, setClosingBalance] = useState<string>('');
  const [financialYear, setFinancialYear] = useState<string>(new Date().getFullYear().toString());
  const [navInput, setNavInput] = useState<Omit<NAV, 'LAST_UPDATED'>>({
    type: '',
    fund_name: '',
    unique_identifier: '',
    nav: undefined,
  });

  // Mutation for updating yearly closing balance
  const updateYearlyBalanceMutation = useMutation({
    mutationFn: (data: { financial_year: string; closing_balance: number }) =>
      configAPI.updateYearlyClosingBalance(data),
    onSuccess: () => {
      yearlyBalanceQuery.refetch();
      setClosingBalance('');
      alert('Yearly closing balance updated successfully!');
    },
    onError: () => {
      alert('Failed to update yearly closing balance. Please try again.');
    },
  });

  // Mutation for adding NAV fund
  const addNavMutation = useMutation({
    mutationFn: (data: Omit<NAV, 'LAST_UPDATED'>) => configAPI.addNav(data),
    onSuccess: () => {
      setNavInput({ type: '', fund_name: '', unique_identifier: '', nav: undefined });
      alert('Fund added successfully!');
    },
    onError: () => {
      alert('Failed to add fund. Please try again.');
    },
  });

  if (profileQuery.isLoading || configQuery.isLoading || yearlyBalanceQuery.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profileQuery.data) {
    return <p className="p-6 text-red-600">Failed to load profile.</p>;
  }

  const profile = profileQuery.data as UserProfile;
  const config = configQuery.data as Config | undefined;
  const yearlyBalance = yearlyBalanceQuery.data as YearlyClosingBankBalance | undefined;

  const handleYearlyBalanceSubmit = () => {
    const numBalance = parseFloat(closingBalance);
    if (isNaN(numBalance) || numBalance < 0) {
      alert('Please enter a valid positive number');
      return;
    }
    updateYearlyBalanceMutation.mutate({
      financial_year: financialYear,
      closing_balance: numBalance,
    });
  };

  const handleNavInputChange = (
    field: keyof Omit<NAV, 'LAST_UPDATED'>,
    value: string | number | undefined
  ) => {
    setNavInput((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddNavSubmit = () => {
    if (!navInput.type || !navInput.fund_name || !navInput.unique_identifier) {
      alert('Please fill in all required fields (Type, Fund Name, Unique Identifier)');
      return;
    }
    addNavMutation.mutate(navInput);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-2">Profile & Configuration</h1>
        <p className="text-blue-100">Manage your account settings and financial configurations</p>
      </div>

      {/* User Information */}
      <Card>
        <CardHeader title="User Information" />
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-lg">
                  {profile.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Username</p>
                <p className="font-semibold">{profile.username}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-semibold text-sm">ID</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">User ID</p>
                <p className="font-mono text-sm">{profile.id}</p>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Configuration Dates */}
      <Card>
        <CardHeader title="System Configuration" />
        <CardBody>
          {config ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(config).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center p-3 border rounded-lg">
                  <span className="font-medium text-gray-700">
                    {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                  <span className="text-gray-600 bg-gray-100 px-3 py-1 rounded-full text-sm">
                    {value ? new Date(value).toLocaleDateString() : 'Not Set'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No configuration data available.</p>
          )}
        </CardBody>
      </Card>

      {/* Financial Summary */}
      <Card>
        <CardHeader title="Financial Summary" />
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Current Bank Balance</h3>
              <p className="text-2xl font-bold text-green-600">
                {yearlyBalance?.closing_balance !== undefined
                  ? `₹${yearlyBalance.closing_balance.toLocaleString()}`
                  : 'Not Available'}
              </p>
              <p className="text-sm text-green-600 mt-1">
                Financial Year: {yearlyBalance?.financial_year || 'N/A'}
              </p>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Last Updated</h3>
              <p className="text-sm text-blue-600">
                <strong>General:</strong> {config?.last_updated_date ? new Date(config.last_updated_date).toLocaleDateString() : 'N/A'}
              </p>
              <p className="text-sm text-blue-600">
                <strong>Investment:</strong> {config?.invest_last_updated_date ? new Date(config.invest_last_updated_date).toLocaleDateString() : 'N/A'}
              </p>
              <p className="text-sm text-blue-600">
                <strong>Expense:</strong> {config?.expense_last_updated_date ? new Date(config.expense_last_updated_date).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Update Yearly Closing Balance */}
      <Card>
        <CardHeader title="Update Yearly Closing Balance" />
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Financial Year
              </label>
              <Input
                type="text"
                placeholder="e.g., 2024"
                value={financialYear}
                onChange={(e) => setFinancialYear(e.target.value)}
                disabled={updateYearlyBalanceMutation.isPending}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Closing Balance (₹)
              </label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={closingBalance}
                onChange={(e) => setClosingBalance(e.target.value)}
                disabled={updateYearlyBalanceMutation.isPending}
              />
            </div>
            <Button
              onClick={handleYearlyBalanceSubmit}
              disabled={updateYearlyBalanceMutation.isPending || !closingBalance || !financialYear}
              variant="primary"
              className="w-full"
            >
              {updateYearlyBalanceMutation.isPending ? 'Updating...' : 'Update Balance'}
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Add Fund (NAV) */}
      <Card>
        <CardHeader title="Add Investment Fund (NAV)" />
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
              <Input
                placeholder="e.g., MUTUALFUND, STOCK"
                value={navInput.type}
                onChange={(e) => handleNavInputChange('type', e.target.value)}
                disabled={addNavMutation.isPending}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fund Name *</label>
              <Input
                placeholder="e.g., HDFC Top 100 Fund"
                value={navInput.fund_name}
                onChange={(e) => handleNavInputChange('fund_name', e.target.value)}
                disabled={addNavMutation.isPending}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Unique Identifier *</label>
              <Input
                placeholder="ISIN, AMFI Code, or Ticker"
                value={navInput.unique_identifier}
                onChange={(e) => handleNavInputChange('unique_identifier', e.target.value)}
                disabled={addNavMutation.isPending}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">NAV (Optional)</label>
              <Input
                type="number"
                step="0.01"
                placeholder="Current NAV value"
                value={navInput.nav ?? ''}
                onChange={(e) =>
                  handleNavInputChange('nav', e.target.value ? parseFloat(e.target.value) : undefined)
                }
                disabled={addNavMutation.isPending}
              />
            </div>
          </div>
          <Button
            onClick={handleAddNavSubmit}
            disabled={addNavMutation.isPending}
            variant="primary"
            className="w-full md:w-auto"
          >
            {addNavMutation.isPending ? 'Adding Fund...' : 'Add Fund'}
          </Button>
        </CardBody>
      </Card>
    </div>
  );
};

export default Profile;
