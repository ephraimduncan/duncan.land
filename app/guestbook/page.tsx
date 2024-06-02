import { Button } from "@/components/button";
import { auth } from "@/lib/auth";

import { SignDialog } from "./sign-dialog";
import { logout } from "@/lib/actions/logout";
import { db } from "@/lib/db";

export default async function GuestbookPage() {
    const { user } = await auth();
    const posts = db
        .prepare(
            "SELECT post.*, user.username, user.name FROM post JOIN user ON post.user_id = user.id ORDER BY post.created_at DESC"
        )
        .all();

    return (
        <section>
            <h1 className="font-medium text-2xl mb-4 tracking-tighter">Sign my guestbook</h1>

            {user ? (
                <>
                    <div className="flex gap-4 mb-10">
                        <SignDialog user={user} />
                        <form action={logout}>
                            <Button type="submit">Sign out</Button>
                        </form>
                    </div>

                    <div>
                        <ul className="space-y-4">
                            {posts.map((post: any) => (
                                <li key={post.id} className="flex gap-4">
                                    <div>
                                        <p className="text-base leading-5 my-2">{post.message}</p>

                                        <div className="flex gap-4 text-sm items-center">
                                            {post.name ? (
                                                <p className="font-bold">{post.name}</p>
                                            ) : (
                                                <p className="font-bold">@{post.username}</p>
                                            )}

                                            <p className="">
                                                {new Date(post.created_at * 1000).toLocaleString("en-US", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
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
