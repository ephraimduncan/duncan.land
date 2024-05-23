import { allPosts } from "@/.contentlayer/generated";
import { formatDistance } from "date-fns";
import Link from "next/link";
import React from "react";

export default function BlogPage() {
    return (
        <div>
            <h1 className="text-2xl flex gap-2 items-center my-6 cursor-pointer">Blog</h1>

            {allPosts.map((post) => (
                <article key={post._id} className="mb-8">
                    <Link href={post.slug} className="flex justify-between items-start">
                        <h2 className="text-lg hover:underline decoration-grey-100 hover:decoration-1 mb-1">
                            {post.title}
                        </h2>
                        <span className="text-sm">
                            {formatDistance(new Date(post.date), new Date(), {
                                addSuffix: true,
                            })}
                        </span>
                    </Link>
                    {post.description && <p className="text-sm text-grey-400">{post.description}</p>}
                </article>
            ))}
        </div>
    );
}
