"use client";

import { Button } from "@/components/button";
import { GithubIcon } from "@/components/ui/GithubIcon";
import { signIn } from "@/lib/auth-client";

type AuthRedirect = "/" | "/guestbook";

interface SignInButtonProps {
  redirectTo: AuthRedirect;
}

export function SignInButton({ redirectTo }: SignInButtonProps) {
  return (
    <Button
      type="button"
      onClick={() => signIn.social({ provider: "github", callbackURL: redirectTo })}
      className="justify-start sm:justify-center"
    >
      <GithubIcon />
      Sign in with GitHub
    </Button>
  );
}
