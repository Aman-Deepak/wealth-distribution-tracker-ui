// src/components/test/AuthTest.tsx
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardHeader, CardBody, Button, Alert } from '../ui';

export const AuthTest: React.FC = () => {
  const { user, isAuthenticated, logout, isLoading, error } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <Card>
          <CardHeader
            title="Authentication Test"
            subtitle="Testing the auth flow"
          />
          <CardBody className="space-y-4">
            {error && (
              <Alert variant="danger">
                {error}
              </Alert>
            )}

            {isAuthenticated ? (
              <div className="space-y-4">
                <Alert variant="success" title="✅ Authentication Successful!">
                  You are successfully logged in.
                </Alert>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">User Info:</h3>
                  <div className="text-sm space-y-1">
                    <p><span className="font-medium">ID:</span> {user?.id}</p>
                    <p><span className="font-medium">Username:</span> {user?.username}</p>
                    <p><span className="font-medium">Status:</span> Authenticated</p>
                  </div>
                </div>

                <Button 
                  onClick={logout} 
                  variant="danger" 
                  fullWidth
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Alert variant="info">
                  You are not authenticated. Please log in.
                </Alert>
                
                <div className="space-y-2">
                  <Button 
                    onClick={() => window.location.href = '/login'}
                    variant="primary" 
                    fullWidth
                  >
                    Go to Login
                  </Button>
                  
                  <Button 
                    onClick={() => window.location.href = '/register'}
                    variant="secondary" 
                    fullWidth
                  >
                    Go to Register
                  </Button>
                </div>
              </div>
            )}

            {/* API Connection Test */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-2">Connection Status:</h4>
              <div className="text-sm">
                <p className="flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  Frontend: Running
                </p>
                <p className="flex items-center">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                  Backend: {process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000'}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};