import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'danger' | 'success' | 'warning' | 'outline';
  className?: string;
  'data-testid'?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className = '',
  'data-testid': testId,
}) => {
  const variants = {
    default: 'bg-indigo-100 text-indigo-800 border-transparent',
    secondary: 'bg-slate-100 text-slate-800 border-transparent',
    danger: 'bg-red-100 text-red-800 border-transparent',
    success: 'bg-green-100 text-green-800 border-transparent',
    warning: 'bg-yellow-100 text-yellow-800 border-transparent',
    outline: 'bg-transparent text-slate-800 border-slate-200',
  };

  return (
    <span
      data-testid={testId}
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
