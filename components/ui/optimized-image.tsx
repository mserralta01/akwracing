'use client';

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ImageConfig } from '@/types/shared';
import { LoadingSpinner } from './loading-spinner';

interface OptimizedImageProps extends ImageConfig {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  onError?: () => void;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  quality = 75,
  format = 'webp',
  className,
  fallbackSrc,
  onError,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleError = () => {
    setError(true);
    setIsLoading(false);
    onError?.();
  };

  if (error && fallbackSrc) {
    return (
      <Image
        src={fallbackSrc}
        alt={alt}
        width={width}
        height={height}
        className={className}
      />
    );
  }

  return (
    <div className="relative">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        quality={quality}
        className={cn(
          className,
          isLoading && 'blur-sm',
          'transition-all duration-300'
        )}
        onLoadingComplete={() => setIsLoading(false)}
        onError={handleError}
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
          <LoadingSpinner isLoading variant="small" />
        </div>
      )}
    </div>
  );
} 