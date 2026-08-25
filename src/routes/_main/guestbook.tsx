import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import * as stylex from "@stylexjs/stylex";
import * as FadeIn from "@/components/motion";
import { getSession } from "@/lib/auth-server";
import { getGuestbookPosts } from "@/lib/data/guestbook";
import { PostsList } from "@/components/guestbook/posts-list";
import { SignDialog } from "@/components/guestbook/sign-dialog";
import { SignInButton } from "@/components/guestbook/sign-in-button";
import { SignOutButton } from "@/components/guestbook/sign-out-button";
import { WallButton } from "@/components/guestbook/wall-button";

const getInitialPosts = createServerFn({ method: "GET" }).handler(() => {
  return getGuestbookPosts(0);
});

export const Route = createFileRoute("/_main/guestbook")({
  loader: async () => {
    const [authState, initialPosts] = await Promise.all([
      getSession(),
      getInitialPosts().catch(() => null),
    ]);
    return { authState, initialPosts };
  },
  head: () => ({
    meta: [
      { title: "Guestbook | Ephraim Duncan" },
      {
        name: "description",
        content: "Sign Ephraim Duncan's guestbook and leave a message.",
      },
      { property: "og:title", content: "Guestbook | Ephraim Duncan" },
      {
        property: "og:description",
        content: "Sign Ephraim Duncan's guestbook and leave a message.",
      },
    ],
  }),
  component: GuestbookPage,
});

function GuestbookPage() {
  const { authState, initialPosts } = Route.useLoaderData();

  return (
    <FadeIn.Container>
      <FadeIn.Item>
        {authState.user ? (
          <div {...stylex.props(styles.stack)}>
            <h1 {...stylex.props(styles.title)}>Hello, {authState.user.name}!</h1>
            <div {...stylex.props(styles.actions, styles.fullActions)}>
              <SignDialog user={authState.user} />
              <SignOutButton />
            </div>
          </div>
        ) : (
          <div {...stylex.props(styles.stack)}>
            <h1 {...stylex.props(styles.title)}>Sign the guestbook</h1>
            <div {...stylex.props(styles.actions)}>
              <SignInButton redirectTo="/guestbook" />
              <WallButton />
            </div>
          </div>
        )}
      </FadeIn.Item>
      <FadeIn.Item>
        <div>
          <PostsList initialPosts={initialPosts} />
        </div>
      </FadeIn.Item>
    </FadeIn.Container>
  );
}

const styles = stylex.create({
  stack: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  title: {
    fontSize: "1.5rem",
    lineHeight: "2rem",
    fontWeight: 500,
    letterSpacing: "-0.025em",
    textWrap: "balance",
  },
  actions: {
    display: "flex",
    flexDirection: {
      default: "column",
      "@media (min-width: 640px)": "row",
    },
    gap: "0.5rem",
  },
  fullActions: {
    width: "100%",
    alignItems: {
      default: "normal",
      "@media (min-width: 640px)": "center",
    },
    justifyContent: {
      default: "normal",
      "@media (min-width: 640px)": "space-between",
    },
  },
});
