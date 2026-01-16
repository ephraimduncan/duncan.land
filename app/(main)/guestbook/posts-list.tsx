'use client';

import { useGuestbookPosts } from "@/lib/hooks/use-guestbook";
import { Button } from "@/components/button";
import { Loader } from "lucide-react";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { PostCard } from "./post-card";

/**
 * Infinite scroll posts list
 * Uses React Query's useInfiniteQuery
 */
export function PostsList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error
  } = useGuestbookPosts();

  // Trigger fetch 1000px before reaching the Load More button for seamless scrolling
  const { ref, inView } = useInView({
    rootMargin: '1000px', // Start fetching when button is 1000px away
    threshold: 0,
  });

  // Auto-fetch on scroll
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  // Error state (with toast already shown)
  if (isError) {
    return (
      <div className="text-center py-8 text-grey-600 dark:text-grey-400">
        Failed to load posts. Please try again later.
      </div>
    );
  }

  const posts = data?.posts || [];

  if (posts.length === 0) {
    return (
      <div className="text-center py-8 text-grey-600 dark:text-grey-400">
        No posts yet. Be the first to sign!
      </div>
    );
  }

  return (
    <>
      <ul className="grid grid-cols-12 gap-5 mt-10">
        {posts.map((post) => (
          <li key={post.id} className="flex col-span-12 sm:col-span-6">
            <PostCard post={post} />
          </li>
        ))}
      </ul>

      {/* Infinite scroll trigger */}
      {hasNextPage && (
        <div ref={ref} className="flex justify-center mt-4">
          <Button disabled={isFetchingNextPage}>
            {isFetchingNextPage ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More"
            )}
          </Button>
        </div>
      )}
    </>
  );
}
