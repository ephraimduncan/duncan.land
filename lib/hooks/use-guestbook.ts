import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  type InfiniteData,
  type UseInfiniteQueryResult,
} from "@tanstack/react-query";
import { guestbookApi } from "@/lib/api/guestbook";
import { guestbookKeys } from "@/lib/query/query-keys";
import type { GuestbookPost, GuestbookPostsResponse, SignGuestbookInput } from "@/types/guestbook";
import { toast } from "sonner";

type GuestbookPostsQuery = InfiniteData<GuestbookPostsResponse, number>;

/** Selected shape returned by useGuestbookPosts. */
interface GuestbookPostsResult {
  pages: GuestbookPostsResponse[];
  pageParams: number[];
  posts: GuestbookPost[];
}

/**
 * Fetches guestbook posts with infinite scroll.
 *
 * When `initialPosts` is provided (from the route loader), it seeds the query
 * cache so the first page renders immediately without a client-side fetch.
 *
 * Return type is explicitly widened to UseInfiniteQueryResult because React
 * Query's overloads resolve initialData: T | undefined to the DefinedInitialData
 * variant, excluding 'pending' from status — even though the param is optional.
 */
export function useGuestbookPosts(
  initialPosts?: GuestbookPostsResponse,
): UseInfiniteQueryResult<GuestbookPostsResult, Error> {
  const initialData: GuestbookPostsQuery | undefined = initialPosts
    ? { pages: [initialPosts], pageParams: [0] }
    : undefined;

  return useInfiniteQuery({
    queryKey: guestbookKeys.posts,
    queryFn: ({ pageParam }) => guestbookApi.getPosts(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage: GuestbookPostsResponse) =>
      lastPage.hasMore ? lastPage.nextCursor : undefined,
    select: (data) => ({
      pages: data.pages,
      pageParams: data.pageParams,
      posts: data.pages.flatMap((page) => page.posts),
    }),
    initialData,
    // Prevent immediate refetch when SSR data is fresh
    initialDataUpdatedAt: initialPosts ? Date.now() : undefined,
  });
}

export function useSignGuestbook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ author: _author, ...input }: SignGuestbookInput) => guestbookApi.sign(input),

    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: guestbookKeys.all });

      const previousPosts = queryClient.getQueryData<GuestbookPostsQuery>(guestbookKeys.posts);

      queryClient.setQueryData<GuestbookPostsQuery>(guestbookKeys.posts, (old) => {
        if (!old) return old;

        const optimisticPost: GuestbookPost = {
          id: `temp-${Date.now()}`,
          message: variables.message,
          signature: variables.signature,
          created_at: new Date().toISOString(),
          username: variables.author.username,
          name: variables.author.name,
        };

        return {
          ...old,
          pages: old.pages.map((page, index) =>
            index === 0 ? { ...page, posts: [optimisticPost, ...page.posts] } : page,
          ),
        };
      });

      return { previousPosts };
    },

    onSuccess: () => {
      toast.success("Successfully signed the guestbook!");
    },

    onError: (error, _variables, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(guestbookKeys.posts, context.previousPosts);
      }

      const message = error instanceof Error ? error.message : "Failed to sign guestbook";
      toast.error(message);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: guestbookKeys.all });
    },
  });
}
