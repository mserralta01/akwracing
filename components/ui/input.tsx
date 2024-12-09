import * as React from 'react';

import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, onClick, ...props }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
      if (
        type === 'number' ||
        e.currentTarget.id?.toLowerCase().includes('price') ||
        e.currentTarget.id?.toLowerCase().includes('rate') ||
        e.currentTarget.id?.toLowerCase().includes('stock') ||
        e.currentTarget.id?.toLowerCase().includes('quantity') ||
        e.currentTarget.id?.toLowerCase().includes('amount') ||
        e.currentTarget.name?.toLowerCase().includes('price') ||
        e.currentTarget.name?.toLowerCase().includes('rate') ||
        e.currentTarget.name?.toLowerCase().includes('stock') ||
        e.currentTarget.name?.toLowerCase().includes('quantity') ||
        e.currentTarget.name?.toLowerCase().includes('amount')
      ) {
        e.currentTarget.select();
      }
      onClick?.(e);
    };

    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        onClick={handleClick}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
