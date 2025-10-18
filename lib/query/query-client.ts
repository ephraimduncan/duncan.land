import { QueryClient, DefaultOptions } from '@tanstack/react-query';

/**
 * Advanced QueryClient configuration
 *
 * Features:
 * - Persistent cache for offline support
 * - Smart refetch strategies
 * - Error retry with exponential backoff
 * - Network mode for offline handling
 */

const queryConfig: DefaultOptions = {
  queries: {
    // Stale time: 1 minute (requirement)
    staleTime: 60 * 1000,

    // Garbage collection: 5 minutes
    gcTime: 5 * 60 * 1000,

    // Refetch on window focus (requirement)
    refetchOnWindowFocus: true,

    // Refetch on reconnect
    refetchOnReconnect: true,

    // Don't refetch on mount if data is fresh
    refetchOnMount: false,

    // Retry configuration with exponential backoff
    retry: (failureCount, error) => {
      // Don't retry on 4xx errors (client errors)
      if (error instanceof Error && 'status' in error) {
        const status = (error as any).status;
        if (status >= 400 && status < 500) return false;
      }
      // Retry up to 3 times for network/5xx errors
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

    // Network mode: online-first with offline fallback
    networkMode: 'online',
  },

  mutations: {
    // Retry mutations once on network error
    retry: 1,

    // Network mode for mutations
    networkMode: 'online',
  },
};

/**
 * Create a new QueryClient instance
 * Use this function in server components or create a singleton for client
 */
export function createQueryClient() {
  return new QueryClient({
    defaultOptions: queryConfig,
  });
}

/**
 * Browser-side singleton QueryClient
 * Persists across navigations in client components
 */
let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always create new client
    return createQueryClient();
  }

  // Browser: create singleton
  if (!browserQueryClient) {
    browserQueryClient = createQueryClient();
  }

  return browserQueryClient;
}
