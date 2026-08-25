import { createFileRoute, redirect } from "@tanstack/react-router";
import * as stylex from "@stylexjs/stylex";
import { getSession } from "@/lib/auth-server";
import { SignInButton } from "@/components/guestbook/sign-in-button";

export const Route = createFileRoute("/_main/login")({
  beforeLoad: async () => {
    const { user } = await getSession();
    if (user) throw redirect({ to: "/" });
  },
  head: () => ({
    meta: [{ title: "Sign In | Ephraim Duncan" }],
  }),
  component: LoginPage,
});

function LoginPage() {
  return (
    <section {...stylex.props(styles.page)}>
      <h1 {...stylex.props(styles.title)}>Sign in</h1>
      <SignInButton redirectTo="/" />
    </section>
  );
}

const styles = stylex.create({
  page: {
    paddingBlock: "1.5rem",
  },
  title: {
    marginBottom: "1rem",
    fontSize: "1.5rem",
    lineHeight: "2rem",
    fontWeight: 500,
    letterSpacing: "-0.025em",
    textWrap: "balance",
  },
});
