// src/pages/auth/RegisterPage.tsx
import React, { useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Card, CardHeader, CardBody } from '../../components/ui';
import { RegisterForm } from '../../components/forms/RegisterForm';
import { useAuth } from '../../contexts/AuthContext';
import banner from '../../assets/images/wealthtracker-banner.svg';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleRegisterSuccess = () => {
    const from = location.state?.from?.pathname || '/';
    navigate(from, { replace: true });
  };

  const handleSwitchToLogin = () => {
    navigate('/login', { state: { from: location.state?.from } });
  };

  if (isAuthenticated) {
    return null; // Don't render while redirecting
  }

  return (
    <div 
      className="min-h-screen flex items-start justify-end py-10 px-6 lg:px-24 relative"
      style={{
          backgroundImage: `url(${banner})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
    >
      <div className="w-full max-w-sm mr-6 lg:mr-12 space-y-1">
        {/* Header */}
        {/* <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-success-600 rounded-xl flex items-center justify-center">
            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Start managing your wealth with our powerful tracker
          </p>
        </div> */}

        {/* Register Card */}
        <Card className="shadow-xl border-0">
          <CardHeader
            title="Sign Up"
            subtitle="Create a new account to get started"
          />
          <CardBody>
            <RegisterForm
              onSuccess={handleRegisterSuccess}
              onSwitchToLogin={handleSwitchToLogin}
            />
          </CardBody>
        </Card>

        {/* Features */}
        <Card variant="bordered" className="bg-white/80 backdrop-blur-sm">
          <CardBody>
            <div className="text-sm space-y-1">
              <h3 className="font-medium text-gray-900">What you get:</h3>
              <div className="space-y-2">
                <div className="flex items-center text-gray-700">
                  <svg className="w-4 h-4 text-success-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Track income, expenses, and investments
                </div>
                <div className="flex items-center text-gray-700">
                  <svg className="w-4 h-4 text-success-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Advanced portfolio analytics
                </div>
                <div className="flex items-center text-gray-700">
                  <svg className="w-4 h-4 text-success-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Professional financial reports
                </div>
                <div className="flex items-center text-gray-700">
                  <svg className="w-4 h-4 text-success-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Bulk data import from Excel/CSV
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;