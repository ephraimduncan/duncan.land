import 'server-only';
import { cache } from 'react';
import { drizzleDb } from '@/lib/drizzle';
import { post, user } from '@/lib/schema';
import { eq, desc, count } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import type { GuestbookPost, GuestbookPostsResponse } from '@/types/guestbook';

const PAGE_SIZE = 40;

/**
 * Fetch paginated guestbook posts with user info
 */
export const getGuestbookPosts = cache(
  async (cursor: number = 0): Promise<GuestbookPostsResponse> => {
    try {
      if (cursor < 0 || !Number.isFinite(cursor)) {
        throw new Error('Invalid cursor parameter');
      }

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
        .orderBy(desc(post.created_at))
        .limit(PAGE_SIZE + 1)
        .offset(cursor);

      const posts: GuestbookPost[] = rows.map(row => ({
        id: row.id,
        message: row.message,
        created_at: row.created_at,
        signature: row.signature,
        username: row.username,
        name: row.name,
      }));

      const hasMore = posts.length > PAGE_SIZE;
      const postsToReturn = hasMore ? posts.slice(0, PAGE_SIZE) : posts;

      return {
        posts: postsToReturn,
        nextCursor: hasMore ? cursor + PAGE_SIZE : null,
        hasMore,
      };
    } catch (error) {
      console.error('[GUESTBOOK_SERVER_FETCH]', error);
      throw new Error('Failed to fetch guestbook posts from database');
    }
  }
);

/**
 * Get total count of guestbook posts
 */
export const getGuestbookCount = cache(async (): Promise<number> => {
  try {
    const result = await drizzleDb
      .select({ count: count() })
      .from(post);

    return result[0]?.count ?? 0;
  } catch (error) {
    console.error('[GUESTBOOK_COUNT]', error);
    return 0;
  }
});

/**
 * Check if user has already signed the guestbook
 */
export async function checkUserHasPost(userId: string): Promise<boolean> {
  try {
    const result = await drizzleDb
      .select({ id: post.id })
      .from(post)
      .where(eq(post.user_id, userId))
      .limit(1);

    return result.length > 0;
  } catch (error) {
    console.error('[GUESTBOOK_CHECK_USER]', error);
    throw new Error('Failed to check user post status');
  }
}

/**
 * Create a new guestbook post
 */
export const createPost = async (data: {
  userId: string;
  message: string;
  signature: string | null;
}): Promise<string> => {
  try {
    const postId = nanoid();

    await drizzleDb.insert(post).values({
      id: postId,
      created_at: new Date(),
      message: data.message,
      user_id: data.userId,
      signature: data.signature,
    });

    return postId;
  } catch (error) {
    console.error('[GUESTBOOK_CREATE_POST]', error);
    throw new Error('Failed to create guestbook post');
  }
};

/**
 * Fetch a single post with user info by ID
 */
export async function getPostWithUser(postId: string): Promise<GuestbookPost> {
  try {
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

    return {
      id: row.id,
      message: row.message,
      created_at: row.created_at,
      signature: row.signature,
      username: row.username,
      name: row.name,
    };
  } catch (error) {
    console.error('[GUESTBOOK_GET_POST]', error);
    throw new Error('Failed to fetch guestbook post');
  }
}
