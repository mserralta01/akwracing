import { useState, useCallback } from 'react';
import { LoadingState } from '@/types/shared';

interface UseLoadingStateOptions {
  initialState?: boolean;
  initialMessage?: string;
}

export function useLoadingState(options: UseLoadingStateOptions = {}) {
  const { initialState = false, initialMessage = '' } = options;

  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: initialState,
    loadingMessage: initialMessage,
  });

  const startLoading = useCallback((message?: string) => {
    setLoadingState({
      isLoading: true,
      loadingMessage: message || loadingState.loadingMessage,
    });
  }, [loadingState.loadingMessage]);

  const stopLoading = useCallback(() => {
    setLoadingState({
      isLoading: false,
      loadingMessage: '',
    });
  }, []);

  const updateLoadingMessage = useCallback((message: string) => {
    setLoadingState(prev => ({
      ...prev,
      loadingMessage: message,
    }));
  }, []);

  return {
    ...loadingState,
    startLoading,
    stopLoading,
    updateLoadingMessage,
  };
} 