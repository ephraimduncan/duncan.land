import { createFileRoute, redirect } from "@tanstack/react-router";
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
    <section className="space-y-4 py-6">
      <h1 className="text-2xl font-medium tracking-tight text-balance">Sign in</h1>
      <SignInButton redirectTo="/" />
    </section>
  );
}
