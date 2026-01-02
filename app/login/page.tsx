import { auth } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import { SignInButton } from "@/app/guestbook/sign-in-button";

export default async function Page() {
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
