import { allThoughts } from "@/.contentlayer/generated";
import { MotionDiv } from "@/components/motion";
import { format } from "date-fns";
import Link from "next/link";
import React from "react";

const variant = {
    hidden: { opacity: 0, y: -5 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function BlogPage() {
    return (
        <MotionDiv initial="hidden" animate="visible" variants={variant} className="space-y-4">
            {allThoughts.map((post) => (
                <article key={post._id} className="">
                    <Link href={post.slug} className="flex gap-8 items-center">
                        <span className="text-base">{format(new Date(post.date), "yyyy-MM-dd")}</span>

                        <h2 className="t hover:underline decoration-grey-100 hover:decoration-1 mb-1">{post.title}</h2>
                    </Link>
                </article>
            ))}
        </MotionDiv>
    );
}
