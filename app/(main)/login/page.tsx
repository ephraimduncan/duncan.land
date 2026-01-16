import { Suspense } from "react";
import { auth } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import { SignInButton } from "@/app/(main)/guestbook/sign-in-button";

async function LoginContent() {
    const { user } = await auth();

    if (user) {
        return redirect("/");
    }
    return (
        <>
            <h1>Sign in</h1>
            <SignInButton callbackURL="/" />
        </>
    );
}

export default function Page() {
    return (
        <Suspense fallback={<div className="animate-pulse h-20 bg-neutral-200 dark:bg-neutral-800 rounded" />}>
            <LoginContent />
        </Suspense>
    );
}
