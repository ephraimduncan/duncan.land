import { Button } from "@/components/button";
import { SignOutIcon } from "@/components/ui/SignoutIcon";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "@tanstack/react-router";

export function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.navigate({ to: "/" });
    router.invalidate();
  }

  return (
    <Button variant="plain" type="button" onClick={handleSignOut}>
      <SignOutIcon />
      Sign out
    </Button>
  );
}
