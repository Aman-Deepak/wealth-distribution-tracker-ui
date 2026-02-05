// src/pages/auth/LoginPage.tsx
import React, { useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Card, CardHeader, CardBody } from '../../components/ui';
import { LoginForm } from '../../components/forms/LoginForm';
import { useAuth } from '../../contexts/AuthContext';
import banner from '../../assets/images/wealthtracker-banner.svg';


const LoginPage: React.FC = () => {
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

  const handleLoginSuccess = () => {
    const from = location.state?.from?.pathname || '/';
    navigate(from, { replace: true });
  };

  const handleSwitchToRegister = () => {
    navigate('/register', { state: { from: location.state?.from } });
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
      <div className="w-full max-w-sm mr-6 lg:mr-12 space-y-4">
        {/* Header */}
        {/* <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-primary-600 rounded-xl flex items-center justify-center">
            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-white-900">
            Sign in to your wealth tracker account
          </p>
        </div> */}

        {/* Login Card */}
        <Card className="shadow-xl border-0">
          <CardHeader
            title="Sign In"
            subtitle="Enter your credentials to access your account"
          />
          <CardBody>
            <LoginForm
              onSuccess={handleLoginSuccess}
              onSwitchToRegister={handleSwitchToRegister}
            />
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;