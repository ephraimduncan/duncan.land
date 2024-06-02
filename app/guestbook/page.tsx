import { Button } from "@/components/button";
import { auth } from "@/lib/auth";

import { SignDialog } from "./sign-dialog";
import { logout } from "@/lib/actions/logout";
import { db } from "@/lib/db";
import { Card } from "@/components/card";
import Image from "next/image";

type PostsQuery = {
    id: string;
    message: string;
    created_at: number;
    signature: string;
    username: string;
    name: string;
};

export default async function GuestbookPage() {
    const { user } = await auth();
    const postsQuery = await db.execute(
        "SELECT post.*, user.username, user.name FROM post JOIN user ON post.user_id = user.id ORDER BY post.created_at DESC"
    );
    const posts = postsQuery.rows as unknown as PostsQuery[];

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

                    <ul className="grid grid-cols-12 gap-5">
                        {posts.map((post) => (
                            <li key={post.id} className="flex col-span-6">
                                {/* <Card className="rounded-lg space-y-3">
                                    <p className="text-sm leading-6 text-grey-900 dark:text-grey-50">{post.message}</p>

                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col text-sm">
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
                                        <div className="dark:invert">
                                            <Image alt="signature" src={post.signature} width={150} height={150} />
                                        </div>
                                    </div>
                                </Card> */}
                                <Card className="rounded-lg flex flex-col justify-between space-y-3 h-full">
                                    <p className="text-sm leading-6 text-grey-900 dark:text-grey-50">{post.message}</p>

                                    <div className="mt-auto flex items-center justify-between">
                                        <div className="flex flex-col text-sm">
                                            {post.name ? (
                                                <p className="font-bold">{post.name}</p>
                                            ) : (
                                                <p className="font-bold">@{post.username}</p>
                                            )}

                                            <p>
                                                {new Date(post.created_at * 1000).toLocaleString("en-US", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </p>
                                        </div>
                                        <div className="dark:invert">
                                            <Image alt="signature" src={post.signature} width={150} height={150} />
                                        </div>
                                    </div>
                                </Card>
                            </li>
                        ))}
                    </ul>
                </>
            ) : (
                <Button href="/login/github" color="light">
                    Sign in with GitHub
                </Button>
            )}
        </section>
    );
}
