import * as FadeIn from "@/components/motion";
import { Suspense } from "react";
import { auth } from "@/lib/auth-server";
import { SignDialog } from "./sign-dialog";
import { SignInButton } from "./sign-in-button";
import { SignOutButton } from "./sign-out-button";

interface GuestLayoutProps {
  children: React.ReactNode;
}

// Separate component for auth-dependent content (uses headers() internally)
async function AuthSection() {
  const { user } = await auth();

  return (
    <div className="space-y-4">
      <h1 className="font-medium text-2xl tracking-tighter">
        {user ? `Hello, ${user.name}!` : "Sign my guestbook"}
      </h1>

      {user ? (
        <div className="flex w-full justify-between items-center">
          <SignDialog user={user} />
          <SignOutButton />
        </div>
      ) : (
        <SignInButton />
      )}
    </div>
  );
}

// Loading fallback for auth section
function AuthSectionFallback() {
  return (
    <div className="space-y-4">
      <h1 className="font-medium text-2xl tracking-tighter">Sign my guestbook</h1>
      <div className="h-10 w-32 bg-grey-200 dark:bg-grey-800 rounded animate-pulse" />
    </div>
  );
}

export default function GuestLayout({ children }: GuestLayoutProps) {
  return (
    <FadeIn.Container>
      <FadeIn.Item>
        <Suspense fallback={<AuthSectionFallback />}>
          <AuthSection />
        </Suspense>
      </FadeIn.Item>

      <FadeIn.Item>
        <div className="space-y-4">{children}</div>
      </FadeIn.Item>
    </FadeIn.Container>
  );
}
