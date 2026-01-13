import 'server-only';
import { cacheTag, cacheLife } from 'next/cache';
import { drizzleDb } from '@/lib/drizzle';
import { post, user } from '@/lib/schema';
import { eq, desc, count } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import type { GuestbookPost, GuestbookPostsResponse } from '@/types/guestbook';

const PAGE_SIZE = 40;

export async function getGuestbookPosts(cursor: number = 0): Promise<GuestbookPostsResponse> {
  "use cache"
  cacheTag('guestbook');
  cacheLife('minutes');

  if (cursor < 0 || !Number.isFinite(cursor)) {
    throw new Error('Invalid cursor parameter');
  }

  const posts = await drizzleDb
    .select({
      id: post.id,
      message: post.message,
      created_at: post.created_at,
      signature: post.signature,
      username: user.username,
      name: user.name,
    })
    .from(post)
    .innerJoin(user, eq(post.user_id, user.id))
    .orderBy(desc(post.created_at))
    .limit(PAGE_SIZE + 1)
    .offset(cursor);

  const hasMore = posts.length > PAGE_SIZE;

  return {
    posts: hasMore ? posts.slice(0, PAGE_SIZE) : posts,
    nextCursor: hasMore ? cursor + PAGE_SIZE : null,
    hasMore,
  };
}

export async function getGuestbookCount(): Promise<number> {
  "use cache"
  cacheTag('guestbook');
  cacheLife('minutes');

  const result = await drizzleDb
    .select({ count: count() })
    .from(post);

  return result[0]?.count ?? 0;
}

export async function checkUserHasPost(userId: string): Promise<boolean> {
  const result = await drizzleDb
    .select({ id: post.id })
    .from(post)
    .where(eq(post.user_id, userId))
    .limit(1);

  return result.length > 0;
}

export async function createPost(data: {
  userId: string;
  message: string;
  signature: string | null;
}): Promise<string> {
  const postId = nanoid();

  await drizzleDb.insert(post).values({
    id: postId,
    created_at: new Date(),
    message: data.message,
    user_id: data.userId,
    signature: data.signature,
  });

  return postId;
}

export async function getPostWithUser(postId: string): Promise<GuestbookPost> {
  const rows = await drizzleDb
    .select({
      id: post.id,
      message: post.message,
      created_at: post.created_at,
      signature: post.signature,
      username: user.username,
      name: user.name,
    })
    .from(post)
    .innerJoin(user, eq(post.user_id, user.id))
    .where(eq(post.id, postId))
    .limit(1);

  const row = rows[0];
  if (!row) {
    throw new Error('Post not found');
  }

  return row;
}
