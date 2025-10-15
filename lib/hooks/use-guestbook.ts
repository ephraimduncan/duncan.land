'use client';

import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { guestbookApi } from '@/lib/api/guestbook';
import { guestbookKeys } from '@/lib/query/query-keys';
import type { SignGuestbookInput, GuestbookPost } from '@/types/guestbook';
import { toast } from 'sonner';

/**
 * Custom hooks for guestbook operations
 *
 * Encapsulates:
 * - Query/mutation configuration
 * - Optimistic updates
 * - Cache invalidation
 * - Error handling
 * - Loading states
 */

// ============================================================================
// QUERIES
// ============================================================================

/**
 * Hook: Infinite scroll posts list
 *
 * Features:
 * - Cursor-based pagination
 * - Automatic fetch on scroll
 * - Stale-while-revalidate pattern
 * - Optimistic updates from mutations
 */
export function useGuestbookPosts() {
  return useInfiniteQuery({
    queryKey: guestbookKeys.postsList(),

    queryFn: async ({ pageParam }) => {
      return guestbookApi.getPosts(pageParam);
    },

    initialPageParam: 0,

    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.nextCursor : undefined;
    },

    select: (data) => ({
      pages: data.pages,
      pageParams: data.pageParams,
      // Flatten posts for easier rendering
      posts: data.pages.flatMap(page => page.posts),
    }),
  });
}

/**
 * Hook: Check if user can sign guestbook
 *
 * Used to conditionally show sign button
 */
export function useGuestbookEligibility() {
  return useQuery({
    queryKey: guestbookKeys.eligibility(),
    queryFn: () => guestbookApi.checkEligibility(),
    // Cache eligibility check for 5 minutes
    staleTime: 5 * 60 * 1000,
  });
}

// ============================================================================
// MUTATIONS
// ============================================================================

/**
 * Hook: Sign guestbook mutation
 *
 * Features:
 * - Optimistic updates
 * - Automatic cache invalidation
 * - Toast notifications
 * - Error rollback
 */
export function useSignGuestbook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: SignGuestbookInput) => guestbookApi.sign(input),

    // Optimistic update
    onMutate: async (variables) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: guestbookKeys.posts()
      });

      // Snapshot previous value
      const previousPosts = queryClient.getQueryData(
        guestbookKeys.postsList()
      );

      // Optimistically update - add temporary post at top
      queryClient.setQueryData(
        guestbookKeys.postsList(),
        (old: any) => {
          if (!old) return old;

          // Create optimistic post with real user data
          const optimisticPost: GuestbookPost = {
            id: `temp-${Date.now()}`,
            message: variables.message,
            signature: variables.signature,
            created_at: Math.floor(Date.now() / 1000),
            username: variables.optimisticUser?.username || 'You',
            name: variables.optimisticUser?.name || null,
          };

          return {
            ...old,
            pages: old.pages.map((page: any, index: number) =>
              index === 0
                ? { ...page, posts: [optimisticPost, ...page.posts] }
                : page
            ),
          };
        }
      );

      // Return context for rollback
      return { previousPosts };
    },

    // Success
    onSuccess: (data) => {
      toast.success('Successfully signed the guestbook!');

      // Invalidate to fetch real data
      queryClient.invalidateQueries({
        queryKey: guestbookKeys.posts()
      });

      // Update eligibility (user can no longer sign)
      queryClient.setQueryData(
        guestbookKeys.eligibility(),
        { eligible: false, reason: 'Already signed' }
      );
    },

    // Error - rollback optimistic update
    onError: (error, variables, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(
          guestbookKeys.postsList(),
          context.previousPosts
        );
      }

      // Error handling via toast (requirement)
      const message = error instanceof Error
        ? error.message
        : 'Failed to sign guestbook';

      toast.error(message);
    },

    // Always refetch after mutation settles
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: guestbookKeys.posts()
      });
    },
  });
}
