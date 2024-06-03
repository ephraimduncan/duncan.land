import { Button } from "@/components/button";
import { auth } from "@/lib/auth";

import { SignDialog } from "./sign-dialog";
import { logout } from "@/lib/actions/logout";
import { db } from "@/lib/db";
import { Card } from "@/components/card";
import Image from "next/image";
import { MotionDiv } from "@/components/motion";
import { GithubIcon } from "@/components/ui/GithubIcon";
import { SignOutIcon } from "@/components/ui/SignoutIcon";

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

    const variant = {
        hidden: { opacity: 0, y: -5 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: -5, transition: { delay: 0.2 } },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } },
    };

    return (
        <section>
            <MotionDiv initial="hidden" animate="visible" variants={variant} className="space-y-4">
                <h1 className="font-medium text-2xl tracking-tighter">Sign my guestbook</h1>

                {user ? (
                    <>
                        <div className="flex w-full justify-between items-center">
                            <SignDialog user={user} />
                            <form action={logout}>
                                <Button plain type="submit">
                                    <SignOutIcon />
                                    Sign out
                                </Button>
                            </form>
                        </div>
                    </>
                ) : (
                    <Button href="/login/github" color="light">
                        <GithubIcon />
                        Sign in with GitHub
                    </Button>
                )}
            </MotionDiv>

            <MotionDiv initial="hidden" animate="visible" variants={cardVariants} className="space-y-4">
                <ul className="grid grid-cols-12 gap-5 mt-10">
                    {posts.map((post) => (
                        <li key={post.id} className="flex col-span-12 sm:col-span-6">
                            <Card className="rounded-lg flex flex-col justify-between space-y-3 h-full">
                                <p className="leading-6 text-grey-900 dark:text-grey-50">{post.message}</p>

                                <div className="mt-auto flex items-center justify-between">
                                    <div className="flex flex-col justify-end h-full text-sm">
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
                                                hour: "numeric",
                                                minute: "numeric",
                                            })}
                                        </p>
                                    </div>
                                    <div className="dark:invert -mb-4 -mr-4">
                                        <Image alt="signature" src={post.signature} width={150} height={150} />
                                    </div>
                                </div>
                            </Card>
                        </li>
                    ))}
                </ul>
            </MotionDiv>
        </section>
    );
}
