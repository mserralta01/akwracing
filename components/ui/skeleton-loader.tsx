'use client';

import { cn } from '@/lib/utils';

interface SkeletonLoaderProps {
  className?: string;
  variant?: 'card' | 'text' | 'image' | 'table-row';
  count?: number;
}

export function SkeletonLoader({
  className,
  variant = 'text',
  count = 1,
}: SkeletonLoaderProps) {
  const variants = {
    text: 'h-4 w-full',
    card: 'h-[300px] w-full rounded-lg',
    image: 'aspect-square w-full rounded-lg',
    'table-row': 'h-12 w-full',
  };

  const baseClass = cn(
    'animate-pulse bg-muted rounded',
    variants[variant],
    className
  );

  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={baseClass} />
      ))}
    </div>
  );
} 