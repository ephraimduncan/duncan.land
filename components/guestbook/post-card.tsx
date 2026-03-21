import { Card } from "@/components/card";
import type { GuestbookPost } from "@/types/guestbook";
import { formatter } from "@/lib/utils";

interface PostCardProps {
  post: GuestbookPost;
}

export function PostCard({ post }: PostCardProps) {
  const authorName = post.name ?? `@${post.username}`;
  const signedAt = formatter.dateTimeUtc(new Date(post.created_at));

  return (
    <Card className="rounded-lg flex flex-col justify-between space-y-3 h-full">
      <p className="leading-6 text-grey-900 dark:text-grey-50">
        {post.message}
      </p>

      <div className="mt-auto flex items-center justify-between">
        <div className="flex flex-col justify-end h-full text-sm">
          <p className="font-bold">{authorName}</p>
          <p>{signedAt}</p>
        </div>

        {post.signature && (
          <div className="dark:invert -mb-4 -mr-4">
            <img
              alt="signature"
              src={post.signature}
              width={150}
              height={150}
              loading="lazy"
            />
          </div>
        )}
      </div>
    </Card>
  );
}
