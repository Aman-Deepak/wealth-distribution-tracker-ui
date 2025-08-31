// src/components/nav/NAVDisplay.tsx
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { configAPI } from '../../services/api';
import { Card, CardHeader, CardBody, Button } from '../ui';
import { ArrowPathIcon, ClockIcon } from '@heroicons/react/24/outline';

export const NAVDisplay: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: navs, isLoading } = useQuery({
    queryKey: ['navs'],
    queryFn: () => configAPI.getNavs(),
  });

  const updateNavMutation = useMutation({
    mutationFn: () => configAPI.updateNavs(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['navs'] });
    },
  });

  return (
    <Card>
      <CardHeader 
        title="NAV Updates" 
        action={
          <Button
            onClick={() => updateNavMutation.mutate()}
            disabled={updateNavMutation.isPending}
            variant="outline"
            size="sm"
          >
            <ArrowPathIcon className={`h-4 w-4 mr-2 ${updateNavMutation.isPending ? 'animate-spin' : ''}`} />
            {updateNavMutation.isPending ? 'Updating...' : 'Update NAVs'}
          </Button>
        }
      />
      <CardBody>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {navs?.map((nav: any) => (
              <div key={nav.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">{nav.FUND_NAME}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{nav.TYPE} • {nav.UNIQUE_IDENTIFIER}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">₹{nav.NAV?.toFixed(2) || 'N/A'}</p>
                  {nav.LAST_UPDATED && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                      <ClockIcon className="h-3 w-3 mr-1" />
                      {new Date(nav.LAST_UPDATED).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
};
