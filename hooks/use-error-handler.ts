import { useToast } from '@/components/ui/use-toast';
import { ErrorState, ToastConfig } from '@/types/shared';

interface ErrorHandlerOptions extends ToastConfig {
  logToConsole?: boolean;
  throwError?: boolean;
}

export function useErrorHandler() {
  const { toast } = useToast();

  const handleError = (
    error: unknown,
    options: ErrorHandlerOptions = {}
  ): ErrorState => {
    const {
      duration = 5000,
      type = 'error',
      position = 'top-right',
      logToConsole = true,
      throwError = false,
    } = options;

    const errorState: ErrorState = {
      message:
        error instanceof Error
          ? error.message
          : typeof error === 'string'
          ? error
          : 'An unexpected error occurred',
      code: error instanceof Error ? error.name : 'UNKNOWN_ERROR',
      details: error,
    };

    // Show toast notification
    toast({
      title: errorState.code,
      description: errorState.message,
      variant: 'destructive',
      duration,
    });

    // Log to console if enabled
    if (logToConsole) {
      console.error('[Error Handler]:', {
        code: errorState.code,
        message: errorState.message,
        details: errorState.details,
      });
    }

    // Throw error if enabled
    if (throwError) {
      throw error;
    }

    return errorState;
  };

  return { handleError };
} 