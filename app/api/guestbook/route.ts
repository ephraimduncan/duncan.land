import { NextRequest, NextResponse } from 'next/server';
import { getGuestbookPosts } from '@/lib/data/guestbook';

/**
 * GET /api/guestbook
 *
 * Fetch paginated guestbook posts
 * Query params: cursor (offset)
 *
 * Uses the same data layer as SSR for consistency
 */

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

    // Reuse data layer - ensures consistency with SSR
    const response = await getGuestbookPosts(cursor);

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
