import * as FadeIn from "@/components/motion";
import { auth } from "@/lib/auth-server";
import { SignDialog } from "./sign-dialog";
import { SignInButton } from "./sign-in-button";
import { SignOutButton } from "./sign-out-button";

interface GuestLayoutProps {
  children: React.ReactNode;
}

export default async function GuestLayout({ children }: GuestLayoutProps) {
  const { user } = await auth();

  return (
    <FadeIn.Container>
      <FadeIn.Item>
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
      </FadeIn.Item>

      <FadeIn.Item>
        <div className="space-y-4"> {children}</div>
      </FadeIn.Item>
    </FadeIn.Container>
  );
}
