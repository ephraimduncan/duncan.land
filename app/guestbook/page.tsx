import { cacheTag, cacheLife } from "next/cache";
import { Loader } from "lucide-react";
import { Suspense } from "react";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import type { Metadata } from "next";
import { getQueryClient } from "@/lib/query/query-client";
import { guestbookKeys } from "@/lib/query/query-keys";
import { getGuestbookPosts } from "@/lib/data/guestbook";
import type { GuestbookPostsResponse } from "@/types/guestbook";
import { PostsList } from "./posts-list";

export const metadata: Metadata = {
  title: "Guestbook | Ephraim Duncan",
  description: "Sign the guestbook and leave your mark!",
  openGraph: {
    title: "Sign Duncan's Guestbook",
    description: "Leave your mark in the guestbook",
  },
};

export default async function GuestbookPage() {
  "use cache"
  cacheTag('guestbook');
  cacheLife('minutes');

  const queryClient = getQueryClient();

  try {
    await queryClient.prefetchInfiniteQuery({
      queryKey: guestbookKeys.postsList(),
      queryFn: ({ pageParam }) => getGuestbookPosts(pageParam as number),
      initialPageParam: 0,
      getNextPageParam: (lastPage: GuestbookPostsResponse) =>
        lastPage.hasMore ? lastPage.nextCursor : undefined,
    });
  } catch (error) {
    console.error('[GUESTBOOK_PREFETCH]', error);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense
        fallback={
          <div className="flex justify-center py-8">
            <Loader className="h-6 w-6 animate-spin" />
          </div>
        }
      >
        <PostsList />
      </Suspense>
    </HydrationBoundary>
  );
}
