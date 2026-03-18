import { QueryClient, DefaultOptions } from '@tanstack/react-query';

type QueryError = Error & { status?: number };

function getErrorStatus(error: unknown): number | null {
  if (!(error instanceof Error)) {
    return null;
  }

  const { status } = error as QueryError;
  return typeof status === 'number' ? status : null;
}

function shouldRetryQuery(failureCount: number, error: unknown): boolean {
  const status = getErrorStatus(error);

  if (status !== null && status >= 400 && status < 500) {
    return false;
  }

  return failureCount < 3;
}

const defaultOptions: DefaultOptions = {
  queries: {
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: false,
    retry: shouldRetryQuery,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    networkMode: 'online',
  },
  mutations: {
    retry: 1,
    networkMode: 'online',
  },
};

export function createQueryClient(): QueryClient {
  return new QueryClient({ defaultOptions });
}

let browserQueryClient: QueryClient | undefined;

function getBrowserQueryClient(): QueryClient {
  if (!browserQueryClient) {
    browserQueryClient = createQueryClient();
  }

  return browserQueryClient;
}

export function getQueryClient(): QueryClient {
  if (typeof window === 'undefined') {
    return createQueryClient();
  }

  return getBrowserQueryClient();
}
