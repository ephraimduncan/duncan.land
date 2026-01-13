'use client';

import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { guestbookApi } from '@/lib/api/guestbook';
import { guestbookKeys } from '@/lib/query/query-keys';
import type { SignGuestbookInput, GuestbookPost } from '@/types/guestbook';
import { toast } from 'sonner';

export function useGuestbookPosts() {
  return useInfiniteQuery({
    queryKey: guestbookKeys.postsList(),
    queryFn: ({ pageParam }) => guestbookApi.getPosts(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextCursor : undefined,
    select: (data) => ({
      pages: data.pages,
      pageParams: data.pageParams,
      posts: data.pages.flatMap(page => page.posts),
    }),
  });
}

export function useGuestbookEligibility() {
  return useQuery({
    queryKey: guestbookKeys.eligibility(),
    queryFn: () => guestbookApi.checkEligibility(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useSignGuestbook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: SignGuestbookInput) => guestbookApi.sign(input),

    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: guestbookKeys.all });

      const previousPosts = queryClient.getQueryData(guestbookKeys.postsList());

      queryClient.setQueryData(
        guestbookKeys.postsList(),
        (old: unknown) => {
          if (!old) return old;

          const optimisticPost: GuestbookPost = {
            id: `temp-${Date.now()}`,
            message: variables.message,
            signature: variables.signature,
            created_at: new Date(),
            username: variables.optimisticUser?.username || 'You',
            name: variables.optimisticUser?.name || null,
          };

          const oldData = old as { pages: Array<{ posts: GuestbookPost[] }> };
          return {
            ...oldData,
            pages: oldData.pages.map((page, index) =>
              index === 0
                ? { ...page, posts: [optimisticPost, ...page.posts] }
                : page
            ),
          };
        }
      );

      return { previousPosts };
    },

    onSuccess: () => {
      toast.success('Successfully signed the guestbook!');
      queryClient.invalidateQueries({ queryKey: guestbookKeys.all });
      queryClient.setQueryData(
        guestbookKeys.eligibility(),
        { eligible: false, reason: 'Already signed' }
      );
    },

    onError: (error, _variables, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(guestbookKeys.postsList(), context.previousPosts);
      }

      const message = error instanceof Error ? error.message : 'Failed to sign guestbook';
      toast.error(message);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: guestbookKeys.all });
    },
  });
}
