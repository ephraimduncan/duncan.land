import { useGuestbookPosts } from "@/lib/hooks/use-guestbook";
import { Button } from "@/components/button";
import { Loader } from "lucide-react";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { PostCard } from "./post-card";
import type { GuestbookPostsResponse } from "@/types/guestbook";

interface PostsListProps {
  /** First page of posts from the route loader — seeds the query cache for instant render. */
  initialPosts: GuestbookPostsResponse | null;
}

export function PostsList({ initialPosts }: PostsListProps) {
  const guestbookPosts = useGuestbookPosts(initialPosts ?? undefined);
  const { fetchNextPage, hasNextPage, isFetchingNextPage } = guestbookPosts;

  const { ref, inView } = useInView({
    rootMargin: "1000px",
    threshold: 0,
  });

  useEffect(() => {
    if (!inView || !hasNextPage || isFetchingNextPage) {
      return;
    }

    fetchNextPage();
  }, [fetchNextPage, hasNextPage, inView, isFetchingNextPage]);

  if (guestbookPosts.status === "pending") {
    return (
      <div role="status" className="flex justify-center py-8">
        <Loader className="size-6 animate-spin" aria-hidden="true" />
        <span className="sr-only">Loading posts…</span>
      </div>
    );
  }

  if (guestbookPosts.status === "error") {
    return (
      <div role="alert" className="text-center py-8 text-foreground-muted">
        <p>Unable to load posts.</p>
        <Button type="button" className="mt-4" onClick={() => guestbookPosts.refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  const posts = guestbookPosts.data.posts;

  if (posts.length === 0) {
    return (
      <div className="text-center py-8 text-foreground-muted">
        No posts yet. Be the first to sign!
      </div>
    );
  }

  return (
    <>
      <ul role="list" className="mt-10 grid gap-5 sm:grid-cols-2">
        {posts.map((post) => (
          <li key={post.id} className="flex">
            <PostCard post={post} />
          </li>
        ))}
      </ul>

      {hasNextPage && (
        <div ref={ref} className="flex justify-center mt-4">
          <Button disabled={isFetchingNextPage} type="button" onClick={() => fetchNextPage()}>
            {isFetchingNextPage ? (
              <>
                <Loader className="mr-2 size-4 animate-spin" aria-hidden="true" />
                Loading…
              </>
            ) : (
              "Load more"
            )}
          </Button>
        </div>
      )}
      <span role="status" className="sr-only">
        {isFetchingNextPage ? "Loading more posts" : ""}
      </span>
    </>
  );
}
