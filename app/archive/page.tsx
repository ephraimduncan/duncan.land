import { allPosts } from "@/.contentlayer/generated";
import Link from "next/link";
import React from "react";

export default function ArchivePage() {
    const archivedPosts = allPosts.filter((post) => post.archived);

    return (
        <div>
            <h1 className="text-2xl flex gap-2 items-center my-6 cursor-pointer">Archived Posts</h1>
            {archivedPosts.length > 0 ? (
                archivedPosts.map((post) => (
                    <article key={post._id} className="mb-8">
                        <Link href={post.slug} className="flex justify-between items-start">
                            <h2 className="text-lg hover:underline decoration-grey-100 hover:decoration-1 mb-1">
                                {post.title}
                            </h2>
                        </Link>
                        {post.description && <p className="text-sm text-grey-400">{post.description}</p>}
                    </article>
                ))
            ) : (
                <p>No archived posts found.</p>
            )}
        </div>
    );
}
