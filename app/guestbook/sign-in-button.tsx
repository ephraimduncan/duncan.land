"use client";

import { Button } from "@/components/button";
import { GithubIcon } from "@/components/ui/GithubIcon";
import { signIn } from "@/lib/auth-client";

type SignInButtonProps = {
  callbackURL?: string;
};

export function SignInButton({ callbackURL = "/guestbook" }: SignInButtonProps) {
  const handleSignIn = () => {
    signIn.social({
      provider: "github",
      callbackURL,
    });
  };

  return (
    <Button onClick={handleSignIn} color="light">
      <GithubIcon />
      Sign in with GitHub
    </Button>
  );
}
