"use client";

import { Button } from "@/components/button";
import { GithubIcon } from "@/components/ui/GithubIcon";
import { signIn } from "@/lib/auth-client";

interface SignInButtonProps {
  callbackURL?: string;
}

export function SignInButton({ callbackURL = "/guestbook" }: SignInButtonProps) {
  return (
    <Button
      onClick={() => signIn.social({ provider: "github", callbackURL })}
      color="light"
    >
      <GithubIcon />
      Sign in with GitHub
    </Button>
  );
}
