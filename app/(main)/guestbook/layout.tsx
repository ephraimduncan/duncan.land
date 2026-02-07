import { Suspense } from "react";
import * as FadeIn from "@/components/motion";
import { auth } from "@/lib/auth-server";
import { SignDialog } from "./sign-dialog";
import { SignInButton } from "./sign-in-button";
import { SignOutButton } from "./sign-out-button";
import { WallButton } from "./wall-button";

interface GuestLayoutProps {
  children: React.ReactNode;
}

async function AuthContent() {
  const { user } = await auth();

  return (
    <div className="space-y-4">
      <h1 className="font-medium text-2xl tracking-tighter">
        {user ? `Hello, ${user.name}!` : "Sign my guestbook"}
      </h1>

      {user ? (
        <div className="flex flex-col sm:flex-row w-full sm:justify-between sm:items-center gap-2">
          <SignDialog user={user} />
          <SignOutButton />
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-2">
          <SignInButton />
          <WallButton />
        </div>
      )}
    </div>
  );
}

function AuthSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 w-48 bg-neutral-200 dark:bg-neutral-800 rounded" />
      <div className="h-10 w-32 bg-neutral-200 dark:bg-neutral-800 rounded" />
    </div>
  );
}

export default function GuestLayout({ children }: GuestLayoutProps) {
  return (
    <FadeIn.Container>
      <FadeIn.Item>
        <Suspense fallback={<AuthSkeleton />}>
          <AuthContent />
        </Suspense>
      </FadeIn.Item>

      <FadeIn.Item>
        <div className="space-y-4"> {children}</div>
      </FadeIn.Item>
    </FadeIn.Container>
  );
}
