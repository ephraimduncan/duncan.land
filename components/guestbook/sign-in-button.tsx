import * as stylex from "@stylexjs/stylex";
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
      style={styles.button}
    >
      <GithubIcon />
      Sign in with GitHub
    </Button>
  );
}

const styles = stylex.create({
  button: {
    justifyContent: {
      default: "flex-start",
      "@media (min-width: 640px)": "center",
    },
  },
});
