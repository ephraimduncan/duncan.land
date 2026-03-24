import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
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
      { name: "description", content: "Sign the guestbook and leave your mark!" },
      { property: "og:title", content: "Sign Duncan's Guestbook" },
      { property: "og:description", content: "Leave your mark in the guestbook" },
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
          <div className="space-y-4">
            <h1 className="font-medium text-2xl tracking-tighter">Hello, {authState.user.name}!</h1>
            <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <SignDialog user={authState.user} />
              <SignOutButton />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h1 className="font-medium text-2xl tracking-tighter">Sign my guestbook</h1>
            <div className="flex flex-col gap-2 sm:flex-row">
              <SignInButton redirectTo="/guestbook" />
              <WallButton />
            </div>
          </div>
        )}
      </FadeIn.Item>
      <FadeIn.Item>
        <div className="space-y-4">
          <PostsList initialPosts={initialPosts} />
        </div>
      </FadeIn.Item>
    </FadeIn.Container>
  );
}
