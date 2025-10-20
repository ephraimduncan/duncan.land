import 'server-only';
import { cache } from 'react';
import { db } from '@/lib/db';
import type { GuestbookPost, GuestbookPostsResponse } from '@/types/guestbook';

/**
 * Server-side data access layer for guestbook
 * Uses React cache() for request-level memoization
 */

const PAGE_SIZE = 40;

/**
 * Fetch paginated guestbook posts from database
 * @param cursor - Offset for pagination (default: 0)
 * @returns Paginated posts with cursor info
 */
export const getGuestbookPosts = cache(
  async (cursor: number = 0): Promise<GuestbookPostsResponse> => {
    try {
      if (cursor < 0 || !Number.isFinite(cursor)) {
        throw new Error('Invalid cursor parameter');
      }

      // Fetch PAGE_SIZE + 1 to determine if there are more posts
      const postsQuery = await db.execute({
        sql: `
          SELECT
            post.id,
            post.message,
            post.created_at,
            post.signature,
            user.username,
            user.name
          FROM post
          JOIN user ON post.user_id = user.id
          ORDER BY post.created_at DESC
          LIMIT ? OFFSET ?
        `,
        args: [PAGE_SIZE + 1, cursor],
      });

      // Convert to plain objects for RSC serialization
      const posts = postsQuery.rows.map(row => ({ ...row })) as unknown as GuestbookPost[];
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
    const result = await db.execute({
      sql: 'SELECT COUNT(*) as count FROM post',
      args: [],
    });

    // Convert to plain object for RSC serialization
    const row = (result.rows[0] ? { ...result.rows[0] } : null) as { count: number } | null;
    return row?.count ?? 0;
  } catch (error) {
    console.error('[GUESTBOOK_COUNT]', error);
    return 0;
  }
});
