import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import type { GuestbookPostsResponse } from '@/types/guestbook';

/**
 * GET /api/guestbook
 *
 * Fetch paginated guestbook posts
 * Query params: cursor (offset)
 */

const PAGE_SIZE = 40;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cursor = parseInt(searchParams.get('cursor') || '0', 10);

    // Validate cursor
    if (isNaN(cursor) || cursor < 0) {
      return NextResponse.json(
        { error: 'INVALID_CURSOR', message: 'Invalid cursor parameter' },
        { status: 400 }
      );
    }

    // Fetch posts with one extra to determine hasMore
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

    const posts = postsQuery.rows as any[];

    // Check if there are more posts
    const hasMore = posts.length > PAGE_SIZE;
    const postsToReturn = hasMore ? posts.slice(0, PAGE_SIZE) : posts;

    const response: GuestbookPostsResponse = {
      posts: postsToReturn,
      nextCursor: hasMore ? cursor + PAGE_SIZE : null,
      hasMore,
    };

    return NextResponse.json(response, {
      headers: {
        // Cache for 1 minute
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });

  } catch (error) {
    console.error('[GUESTBOOK_GET]', error);

    return NextResponse.json(
      {
        error: 'INTERNAL_ERROR',
        message: 'Failed to fetch guestbook posts'
      },
      { status: 500 }
    );
  }
}
