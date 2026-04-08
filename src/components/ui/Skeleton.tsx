import React from 'react';

interface SkeletonProps {
  className?: string;
  'data-testid'?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', 'data-testid': testId }) => {
  return (
    <div
      data-testid={testId || 'skeleton'}
      className={`animate-pulse rounded-md bg-slate-200 ${className}`}
    />
  );
};
