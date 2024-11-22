import { Button } from "@/components/button";
import * as FadeIn from "@/components/motion";
import { GithubIcon } from "@/components/ui/GithubIcon";
import { SignOutIcon } from "@/components/ui/SignoutIcon";
import { logout } from "@/lib/actions/logout";
import { auth } from "@/lib/auth";
import { SignDialog } from "./sign-dialog";

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
            Sign my guestbook
          </h1>

          {user ? (
            <div className="flex w-full justify-between items-center">
              <SignDialog user={user} />
              <form action={logout}>
                <Button plain type="submit">
                  <SignOutIcon />
                  Sign out
                </Button>
              </form>
            </div>
          ) : (
            <Button href="/login/github" color="light">
              <GithubIcon />
              Sign in with GitHub
            </Button>
          )}
        </div>
      </FadeIn.Item>

      <FadeIn.Item>
        <div className="space-y-4"> {children}</div>
      </FadeIn.Item>
    </FadeIn.Container>
  );
}
