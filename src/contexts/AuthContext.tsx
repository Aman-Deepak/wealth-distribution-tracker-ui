// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { UserProfile, AuthToken, LoginCredentials, RegisterCredentials } from '../types';
import { authAPI, handleApiError } from '../services/api';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!user && !!token;

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('access_token');
        if (storedToken) {
          setToken(storedToken);
          // Verify token by fetching user profile
          const userProfile = await authAPI.getProfile();
          setUser(userProfile);
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        // Token might be expired or invalid
        localStorage.removeItem('access_token');
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      setError(null);

      // Call login API
      const authResponse: AuthToken = await authAPI.login(credentials);
      
      // Store token
      localStorage.setItem('access_token', authResponse.access_token);
      setToken(authResponse.access_token);

      // Fetch user profile
      const userProfile = await authAPI.getProfile();
      setUser(userProfile);

    } catch (error) {
      const errorMessage = handleApiError(error);
      setError(errorMessage);
      throw error; // Re-throw so components can handle it
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      setIsLoading(true);
      setError(null);

      // Call register API
      const authResponse: AuthToken = await authAPI.register(credentials);
      
      // Store token
      localStorage.setItem('access_token', authResponse.access_token);
      setToken(authResponse.access_token);

      // Fetch user profile
      const userProfile = await authAPI.getProfile();
      setUser(userProfile);

    } catch (error) {
      const errorMessage = handleApiError(error);
      setError(errorMessage);
      throw error; // Re-throw so components can handle it
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setToken(null);
    setUser(null);
    setError(null);
  };

  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    error,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};