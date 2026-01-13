import { Suspense } from "react";
import { auth } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import { SignInButton } from "@/app/guestbook/sign-in-button";

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
        <Suspense fallback={<div>Loading...</div>}>
            <LoginContent />
        </Suspense>
    );
}
