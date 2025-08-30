// src/pages/profile/Profile.tsx
import React, { useState } from 'react';
import { useQueries, useMutation } from '@tanstack/react-query';
import { authAPI, configAPI } from '../../services/api';
import { Card, CardHeader, CardBody, Button, Input } from '../../components/ui';
import { Config, YearlyClosingBankBalance, NAV } from '../../types/config';

const Profile: React.FC = () => {
  const [profileQuery, configQuery, yearlyBalanceQuery] = useQueries({
    queries: [
      { queryKey: ['profile'], queryFn: () => authAPI.getProfile() },
      { queryKey: ['userConfig'], queryFn: () => configAPI.getConfig() },
      { queryKey: ['yearlyClosingBalance'], queryFn: () => configAPI.getYearlyClosingBalance() },
    ],
  });

  const [closingBalance, setClosingBalance] = useState<string>('');
  const [navInput, setNavInput] = useState<Omit<NAV, 'LAST_UPDATED'>>({
    TYPE: '',
    FUND_NAME: '',
    UNIQUE_IDENTIFIER: '',
    NAV: undefined,
  });

  const updateYearlyBalanceMutation = useMutation<
    YearlyClosingBankBalance,
    unknown,
    YearlyClosingBankBalance
  >(
    (closing_balance) => configAPI.updateYearlyClosingBalance(closing_balance),
    {
        onSuccess: () => yearlyBalanceQuery.refetch(),
    }
  );

  // Mutation to add NAV fund
  const addNavMutation = useMutation<
    NAV,
    unknown,
    Omit<NAV, 'LAST_UPDATED'>
  >(
    (nav) => configAPI.addNav(nav),
    {
      onSuccess: () => {
        setNavInput({ TYPE: '', FUND_NAME: '', UNIQUE_IDENTIFIER: '', NAV: undefined });
        configQuery.refetch();
      },
    }
  );

  if (
    profileQuery.isLoading ||
    configQuery.isLoading ||
    yearlyBalanceQuery.isLoading
  ) {
    return <p className="p-6">Loading profile and settings...</p>;
  }

  if (!profileQuery.data) {
    return <p className="p-6 text-red-600">Failed to load profile.</p>;
  }

  const profile = profileQuery.data;
  const config = configQuery.data as Config | undefined;
  const yearlyBalance = yearlyBalanceQuery.data as YearlyClosingBankBalance | undefined;

  const handleYearlyBalanceSubmit = () => {
    const numBalance = parseFloat(closingBalance);
    if (isNaN(numBalance)) {
      alert('Please enter a valid number');
      return;
    }
    updateYearlyBalanceMutation.mutate({
      financial_year: new Date().getFullYear().toString(),
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
    if (!navInput.TYPE || !navInput.FUND_NAME || !navInput.UNIQUE_IDENTIFIER) {
      alert('Please fill in all required fields');
      return;
    }
    addNavMutation.mutate(navInput);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-10">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>

      <Card>
        <CardHeader title="User Information" />
        <CardBody>
          <p>
            <strong>Username:</strong> {profile.username}
          </p>
          <p>
            <strong>User ID:</strong> {profile.id}
          </p>
          {profile.email && (
            <p>
              <strong>Email:</strong> {profile.email}
            </p>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Your Configurations" />
        <CardBody>
          {config ? (
            Object.entries(config).map(([key, value]) => (
              <div
                key={key}
                className="flex justify-between py-2 border-b border-gray-100"
              >
                <span className="capitalize font-medium">
                  {key.replace(/_/g, ' ')}
                </span>
                <span className="text-gray-600">{String(value)}</span>
              </div>
            ))
          ) : (
            <p>No settings found.</p>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Financial Summary" />
        <CardBody>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="font-medium">Last Updated</span>
            <span className="text-gray-600">{config?.last_updated_date ?? 'N/A'}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="font-medium">Investment Last Updated</span>
            <span className="text-gray-600">{config?.invest_last_updated_date ?? 'N/A'}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="font-medium">Expense Last Updated</span>
            <span className="text-gray-600">{config?.expense_last_updated_date ?? 'N/A'}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="font-medium">Financial Last Updated</span>
            <span className="text-gray-600">{config?.financial_last_updated_date ?? 'N/A'}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="font-medium">Yearly Closing Bank Balance</span>
            <span className="text-gray-600">
              {yearlyBalance?.closing_balance !== undefined
                ? `₹${yearlyBalance.closing_balance.toLocaleString()}`
                : 'N/A'}
            </span>
          </div>
        </CardBody>
      </Card>

      {/* Update Yearly Closing Balance */}
      <Card>
        <CardHeader title="Update Yearly Closing Balance" />
        <CardBody>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 max-w-md">
            <Input
              type="number"
              placeholder="Enter closing balance"
              value={closingBalance}
              onChange={(e) => setClosingBalance(e.target.value)}
              disabled={updateYearlyBalanceMutation.isLoading}
            />
            <Button
              onClick={handleYearlyBalanceSubmit}
              disabled={updateYearlyBalanceMutation.isLoading}
              variant="primary"
            >
              {updateYearlyBalanceMutation.isLoading ? 'Updating...' : 'Update'}
            </Button>
          </div>
          {updateYearlyBalanceMutation.isError && (
            <p className="mt-2 text-red-600">Failed to update balance. Please try again.</p>
          )}
          {updateYearlyBalanceMutation.isSuccess && (
            <p className="mt-2 text-green-600">Balance updated successfully!</p>
          )}
        </CardBody>
      </Card>

      {/* Add Fund (NAV) */}
      <Card>
        <CardHeader title="Add Fund (NAV)" />
        <CardBody>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
            <Input
              placeholder="Type"
              value={navInput.TYPE}
              onChange={(e) => handleNavInputChange('TYPE', e.target.value)}
              disabled={addNavMutation.isLoading}
            />
            <Input
              placeholder="Fund Name"
              value={navInput.FUND_NAME}
              onChange={(e) => handleNavInputChange('FUND_NAME', e.target.value)}
              disabled={addNavMutation.isLoading}
            />
            <Input
              placeholder="Unique Identifier"
              value={navInput.UNIQUE_IDENTIFIER}
              onChange={(e) => handleNavInputChange('UNIQUE_IDENTIFIER', e.target.value)}
              disabled={addNavMutation.isLoading}
            />
            <Input
              type="number"
              placeholder="NAV (optional)"
              value={navInput.NAV ?? ''}
              onChange={(e) =>
                handleNavInputChange('NAV', e.target.value ? parseFloat(e.target.value) : undefined)
              }
              disabled={addNavMutation.isLoading}
            />
          </div>
          <Button
            onClick={handleAddNavSubmit}
            className="mt-4"
            variant="primary"
            disabled={addNavMutation.isLoading}
          >
            {addNavMutation.isLoading ? 'Adding...' : 'Add Fund'}
          </Button>
          {addNavMutation.isError && (
            <p className="mt-2 text-red-600">Failed to add fund. Please try again.</p>
          )}
          {addNavMutation.isSuccess && (
            <p className="mt-2 text-green-600">Fund added successfully!</p>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default Profile;
