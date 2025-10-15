'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { getQueryClient } from './query-client';
import { useState } from 'react';

/**
 * React Query Provider with DevTools
 *
 * Pattern: useState ensures each request gets a fresh QueryClient
 * in React Server Components environment
 */

export function QueryProvider({ children }: { children: React.ReactNode }) {
  // Create client once per request (SSR-safe)
  const [queryClient] = useState(() => getQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools
          initialIsOpen={false}
          buttonPosition="bottom-left"
        />
      )}
    </QueryClientProvider>
  );
}
