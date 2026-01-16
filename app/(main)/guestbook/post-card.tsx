'use client';

import { Card } from "@/components/card";
import type { GuestbookPost } from "@/types/guestbook";
import Image from "next/image";

interface PostCardProps {
  post: GuestbookPost;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Card className="rounded-lg flex flex-col justify-between space-y-3 h-full">
      <p className="leading-6 text-grey-900 dark:text-grey-50">
        {post.message}
      </p>

      <div className="mt-auto flex items-center justify-between">
        <div className="flex flex-col justify-end h-full text-sm">
          {post.name ? (
            <p className="font-bold">{post.name}</p>
          ) : (
            <p className="font-bold">@{post.username}</p>
          )}
          <p>
            {post.created_at.toLocaleString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
            })}
          </p>
        </div>

        {post.signature && (
          <div className="dark:invert -mb-4 -mr-4">
            <Image
              alt="signature"
              src={post.signature}
              width={150}
              height={150}
            />
          </div>
        )}
      </div>
    </Card>
  );
}
