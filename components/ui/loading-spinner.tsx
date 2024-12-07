'use client';

import { cn } from '@/lib/utils';
import { LoadingState } from '@/types/shared';

interface LoadingSpinnerProps extends LoadingState {
  variant?: 'default' | 'small' | 'large';
  className?: string;
}

export function LoadingSpinner({
  isLoading,
  loadingMessage,
  variant = 'default',
  className,
}: LoadingSpinnerProps) {
  if (!isLoading) return null;

  const sizeClasses = {
    small: 'h-4 w-4 border-2',
    default: 'h-8 w-8 border-3',
    large: 'h-12 w-12 border-4',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-t-transparent border-primary',
          sizeClasses[variant]
        )}
      />
      {loadingMessage && (
        <p className="mt-2 text-sm text-muted-foreground">{loadingMessage}</p>
      )}
    </div>
  );
} 