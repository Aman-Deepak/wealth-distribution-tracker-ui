// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AppLayout } from './components/layout';

// Import pages...
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import Dashboard from './pages/dashboard/Dashboard';
import Transactions from './pages/transactions/Transactions';
import Reports from './pages/reports/Reports';
import Upload from './pages/upload/Upload';
import Profile from './pages/profile/Profile';
import Settings from './pages/settings/Settings'; 
import Portfolio from './pages/portfolio/Portfolio';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <Router>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Protected routes with layout */}
              <Route path="/" element={
                <ProtectedRoute>
                  <AppLayout>
                    <Dashboard />
                  </AppLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/transactions" element={
                <ProtectedRoute>
                  <AppLayout>
                    <Transactions />
                  </AppLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/portfolio" element={
                <ProtectedRoute>
                  <AppLayout>
                    <Portfolio />
                  </AppLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/reports" element={
                <ProtectedRoute>
                  <AppLayout>
                    <Reports />
                  </AppLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/upload" element={
                <ProtectedRoute>
                  <AppLayout>
                    <Upload />
                  </AppLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/profile" element={
                <ProtectedRoute>
                  <AppLayout>
                    <Profile />
                  </AppLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/settings" element={
                <ProtectedRoute>
                  <AppLayout>
                    <Settings />
                  </AppLayout>
                </ProtectedRoute>
              } />
              
              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
