// src/components/ui/Alert.tsx
import React from 'react';
import { clsx } from 'clsx';

export interface AlertProps {
  variant?: 'success' | 'danger' | 'warning' | 'info';
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  children,
  onClose,
  className,
}) => {
  const baseClasses = [
    'rounded-lg border p-4 transition-all duration-200',
  ];

  const variantClasses = {
    success: 'bg-success-50 border-success-200 text-success-800',
    danger: 'bg-danger-50 border-danger-200 text-danger-800',
    warning: 'bg-warning-50 border-warning-200 text-warning-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  const iconClasses = {
    success: '✓',
    danger: '⚠',
    warning: '⚠',
    info: 'ℹ',
  };

  return (
    <div className={clsx(baseClasses, variantClasses[variant], className)}>
      <div className="flex">
        <div className="flex-shrink-0">
          <span className="text-lg">{iconClasses[variant]}</span>
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className="text-sm font-medium mb-1">{title}</h3>
          )}
          <div className="text-sm">{children}</div>
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <button
              onClick={onClose}
              className="inline-flex text-lg hover:opacity-75 transition-opacity"
              aria-label="Close alert"
            >
              ×
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Toast notification system with exported types
export interface ToastProps extends AlertProps {
  id: string;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  id,
  duration = 5000,
  onClose,
  ...alertProps
}) => {
  React.useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <Alert
      {...alertProps}
      onClose={onClose}
      className="animate-slide-up shadow-lg"
    />
  );
};

// Loading Spinner Component with exported types
export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white' | 'gray';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'primary',
  className,
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  const colorClasses = {
    primary: 'text-primary-600',
    white: 'text-white',
    gray: 'text-gray-600',
  };

  return (
    <svg
      className={clsx(
        'animate-spin',
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
};