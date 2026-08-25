import * as stylex from "@stylexjs/stylex";
import { Card } from "@/components/card";
import type { GuestbookPost } from "@/types/guestbook";
import { formatter } from "@/lib/utils";
import "./guestbook-theme.css";

interface PostCardProps {
  post: GuestbookPost;
}

export function PostCard({ post }: PostCardProps) {
  const authorName = post.name ?? `@${post.username}`;
  const signedAt = formatter.dateTimeUtc(new Date(post.created_at));

  return (
    <Card style={styles.card}>
      <p {...stylex.props(styles.message)}>{post.message}</p>

      <div {...stylex.props(styles.footer)}>
        <div {...stylex.props(styles.details)}>
          <p {...stylex.props(styles.author)}>{authorName}</p>
          <p>{signedAt}</p>
        </div>

        {post.signature && (
          <div {...stylex.props(styles.signature)}>
            <img alt="signature" src={post.signature} width={150} height={150} loading="lazy" />
          </div>
        )}
      </div>
    </Card>
  );
}

const styles = stylex.create({
  card: {
    display: "flex",
    height: "100%",
    flexDirection: "column",
    justifyContent: "space-between",
    rowGap: "0.75rem",
    borderRadius: "0.5rem",
  },
  message: {
    color: "var(--guestbook-message-foreground)",
    lineHeight: "1.5rem",
  },
  footer: {
    display: "flex",
    marginTop: "auto",
    alignItems: "center",
    justifyContent: "space-between",
  },
  details: {
    display: "flex",
    height: "100%",
    flexDirection: "column",
    justifyContent: "flex-end",
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
  },
  author: {
    fontWeight: 500,
  },
  signature: {
    marginRight: "-1rem",
    marginBottom: "-1rem",
    filter: "var(--signature-filter)",
  },
});
