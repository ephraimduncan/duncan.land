import { Loader } from "lucide-react";
import { Suspense } from "react";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import type { Metadata } from "next";
import { connection } from "next/server";
import { getQueryClient } from "@/lib/query/query-client";
import { guestbookKeys } from "@/lib/query/query-keys";
import { getGuestbookPosts, getGuestbookCount } from "@/lib/data/guestbook";
import type { GuestbookPostsResponse } from "@/types/guestbook";
import { PostsList } from "./posts-list";

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const [count, { posts }] = await Promise.all([
      getGuestbookCount(),
      getGuestbookPosts(0),
    ]);

    const latestMessage = posts[0]?.message;
    const truncatedMessage = latestMessage?.slice(0, 100);
    const description = latestMessage
      ? `${count} signatures. Latest: "${truncatedMessage}${latestMessage.length > 100 ? "..." : ""}"`
      : `${count} people signed the guestbook. Leave your mark!`;

    return {
      title: "Guestbook | Ephraim Duncan",
      description,
      openGraph: {
        title: "Sign Duncan's Guestbook",
        description: `Join ${count} others who have signed the guestbook`,
      },
    };
  } catch (error) {
    console.error('[GUESTBOOK_METADATA]', error);
    // Fallback metadata if database fails
    return {
      title: "Guestbook | Ephraim Duncan",
      description: "Sign the guestbook and leave your mark!",
      openGraph: {
        title: "Sign Duncan's Guestbook",
        description: "Leave your mark in the guestbook",
      },
    };
  }
}

export default async function GuestbookPage() {
  // React Query uses Date.now() for cache timestamps
  await connection();

  const queryClient = getQueryClient();

  // Prefetch initial posts on server (data is cached via 'use cache' in getGuestbookPosts)
  await queryClient.prefetchInfiniteQuery({
    queryKey: guestbookKeys.postsList(),
    queryFn: ({ pageParam }) => getGuestbookPosts(pageParam as number),
    initialPageParam: 0,
    getNextPageParam: (lastPage: GuestbookPostsResponse) =>
      lastPage.hasMore ? lastPage.nextCursor : undefined,
  });

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
