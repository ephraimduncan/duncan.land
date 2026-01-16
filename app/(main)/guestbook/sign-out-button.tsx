"use client";

import { Button } from "@/components/button";
import { SignOutIcon } from "@/components/ui/SignoutIcon";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <Button plain type="button" onClick={handleSignOut}>
      <SignOutIcon />
      Sign out
    </Button>
  );
}
