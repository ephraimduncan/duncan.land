import * as stylex from "@stylexjs/stylex";
import { useGuestbookPosts } from "@/lib/hooks/use-guestbook";
import { Button } from "@/components/button";
import { Loader } from "lucide-react";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { PostCard } from "./post-card";
import type { GuestbookPostsResponse } from "@/types/guestbook";
import { colors } from "../../src/styles/tokens.stylex";
import { shared } from "../../src/styles/shared";

interface PostsListProps {
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
      <div role="status" {...stylex.props(styles.pending)}>
        <Loader {...stylex.props(styles.spinner, styles.largeSpinner)} aria-hidden="true" />
        <span {...stylex.props(shared.srOnly)}>Loading posts…</span>
      </div>
    );
  }

  if (guestbookPosts.status === "error") {
    return (
      <div role="alert" {...stylex.props(styles.message)}>
        <p>Unable to load posts.</p>
        <Button type="button" style={styles.retry} onClick={() => guestbookPosts.refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  const posts = guestbookPosts.data.posts;

  if (posts.length === 0) {
    return <div {...stylex.props(styles.message)}>No posts yet. Be the first to sign!</div>;
  }

  return (
    <>
      <ul role="list" {...stylex.props(styles.posts)}>
        {posts.map((post) => (
          <li key={post.id} {...stylex.props(styles.post)}>
            <PostCard post={post} />
          </li>
        ))}
      </ul>

      {hasNextPage && (
        <div ref={ref} {...stylex.props(styles.loadMore)}>
          <Button disabled={isFetchingNextPage} type="button" onClick={() => fetchNextPage()}>
            {isFetchingNextPage ? (
              <>
                <Loader {...stylex.props(styles.spinner, styles.smallSpinner)} aria-hidden="true" />
                Loading…
              </>
            ) : (
              "Load more"
            )}
          </Button>
        </div>
      )}
      <span role="status" {...stylex.props(shared.srOnly)}>
        {isFetchingNextPage ? "Loading more posts" : ""}
      </span>
    </>
  );
}

const spin = stylex.keyframes({
  to: {
    transform: "rotate(360deg)",
  },
});

const styles = stylex.create({
  pending: {
    display: "flex",
    justifyContent: "center",
    paddingBlock: "2rem",
  },
  message: {
    paddingBlock: "2rem",
    color: colors.foregroundMuted,
    textAlign: "center",
  },
  retry: {
    marginTop: "1rem",
  },
  posts: {
    display: "grid",
    marginTop: "2.5rem",
    marginBottom: "1rem",
    gridTemplateColumns: {
      default: "none",
      "@media (min-width: 640px)": "repeat(2, minmax(0, 1fr))",
    },
    gap: "1.25rem",
  },
  post: {
    display: "flex",
  },
  loadMore: {
    display: "flex",
    marginTop: "1rem",
    marginBottom: "1rem",
    justifyContent: "center",
  },
  spinner: {
    animationName: spin,
    animationDuration: "1s",
    animationTimingFunction: "linear",
    animationIterationCount: "infinite",
  },
  largeSpinner: {
    width: "1.5rem",
    height: "1.5rem",
  },
  smallSpinner: {
    width: "1rem",
    height: "1rem",
    marginRight: "0.5rem",
  },
});
