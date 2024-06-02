import { Button } from "@/components/button";
import { auth } from "@/lib/auth";

import { SignDialog } from "./sign-dialog";
import { logout } from "@/lib/actions/logout";

export default async function GuestbookPage() {
    const { user } = await auth();

    return (
        <section>
            <h1 className="font-medium text-2xl mb-4 tracking-tighter">Sign my guestbook</h1>

            {user ? (
                <>
                    <div className="flex gap-4">
                        <SignDialog />
                        <form action={logout}>
                            <Button type="submit">Sign out</Button>
                        </form>
                    </div>
                </>
            ) : (
                <Button href="/login/github" color="light">
                    Sign in with GitHub
                </Button>
            )}
        </section>
    );
}
