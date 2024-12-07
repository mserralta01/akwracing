import { ReactNode } from 'react';

export type ErrorState = {
  message: string;
  code?: string;
  details?: unknown;
};

export type LoadingState = {
  isLoading: boolean;
  loadingMessage?: string;
};

export type AsyncState<T> = {
  data?: T;
  error?: ErrorState;
  isLoading: boolean;
};

export type ErrorBoundaryProps = {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error) => void;
};

export type ImageConfig = {
  width: number;
  height: number;
  priority?: boolean;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png' | 'gif';
};

export type ToastConfig = {
  duration?: number;
  type?: 'success' | 'error' | 'warning' | 'info';
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}; 