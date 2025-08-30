// src/components/ui/Input.tsx
import React, { InputHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'filled' | 'outline';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      variant = 'default',
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    const baseInputClasses = [
      'block w-full rounded-lg border transition-colors duration-200',
      'placeholder:text-gray-400',
      'focus:outline-none focus:ring-2 focus:ring-offset-1',
      'disabled:opacity-50 disabled:cursor-not-allowed',
    ];

    const variantClasses = {
      default: [
        'border-gray-300 bg-white',
        'focus:border-primary-500 focus:ring-primary-500',
        error ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500' : '',
      ],
      filled: [
        'border-transparent bg-gray-100',
        'focus:border-primary-500 focus:bg-white focus:ring-primary-500',
        error ? 'bg-danger-50 focus:border-danger-500 focus:ring-danger-500' : '',
      ],
      outline: [
        'border-2 border-gray-300 bg-transparent',
        'focus:border-primary-500 focus:ring-primary-500',
        error ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500' : '',
      ],
    };

    const sizeClasses = leftIcon || rightIcon ? 'py-2.5 px-4' : 'py-2.5 px-3';
    const iconPadding = leftIcon ? 'pl-10' : rightIcon ? 'pr-10' : '';

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">{leftIcon}</span>
            </div>
          )}
          
          <input
            ref={ref}
            id={inputId}
            className={clsx(
              baseInputClasses,
              variantClasses[variant],
              sizeClasses,
              iconPadding,
              className
            )}
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">{rightIcon}</span>
            </div>
          )}
        </div>
        
        {error && (
          <p className="mt-1 text-sm text-danger-600">{error}</p>
        )}
        
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';