import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Page() {
    const { user } = await auth();

    if (user) {
        return redirect("/");
    }
    return (
        <>
            <h1>Sign in</h1>
            <Link href="/login/github">Sign in with GitHub</Link>
        </>
    );
}
